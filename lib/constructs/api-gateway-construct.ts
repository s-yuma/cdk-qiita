import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

interface ApiProps {
  apiName: string;
  route: string;
  methodToLambdaMap: {
    [method: string]: lambda.IFunction;
  };
  authorizer?: apigateway.IAuthorizer;
}

export class ApiGatewayConstruct extends Construct {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id);

    // API Gateway 作成（CORSはCDK自動生成に任せる）
    this.api = new apigateway.RestApi(this, "RestApi", {
      restApiName: props.apiName,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          "Content-Type",
          "Authorization", // JWT認証に必要
          "X-Amz-Date",
          "X-Api-Key",
          "X-Amz-Security-Token",
          "X-Amz-User-Agent",
        ],
        allowCredentials: true, // 認証情報の送信を許可
      },
    });

    // Cognito Authorizer に RestApi をバインド（手動で）
    if (props.authorizer && "restApi" in props.authorizer) {
      // @ts-ignore
      props.authorizer.restApi = this.api;
    }

    // /test エンドポイント作成
    const resource = this.api.root.addResource(props.route);
    const resourceWithId = resource.addResource("{userId}");

    // 認証オプション設定（あれば）
    const methodOptions: apigateway.MethodOptions | undefined = props.authorizer
      ? {
          authorizer: props.authorizer,
          authorizationType: apigateway.AuthorizationType.COGNITO,
        }
      : undefined;

    // 各HTTPメソッドに Lambda をマッピング
    for (const method in props.methodToLambdaMap) {
      resource.addMethod(
        method,
        new apigateway.LambdaIntegration(props.methodToLambdaMap[method]),
        methodOptions
      );
    }

    // GETメソッドを /test/{userId} にも設定
    if (props.methodToLambdaMap["GET"]) {
      resourceWithId.addMethod(
        "GET",
        new apigateway.LambdaIntegration(props.methodToLambdaMap["GET"]),
        methodOptions
      );
    }

    // ※ 手動で OPTIONS メソッドは追加しない（CDK が自動生成するため）
  }
}
