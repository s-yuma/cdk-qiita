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

    // API Gateway 作成（CORSを明示的に無効化してLambda側で処理）
    this.api = new apigateway.RestApi(this, "RestApi", {
      restApiName: props.apiName,
      // CORSをfalseにしてLambda側で完全に制御
      defaultCorsPreflightOptions: undefined,
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

    // OPTIONSメソッドは認証なしで設定
    const optionsMethodOptions: apigateway.MethodOptions = {
      authorizationType: apigateway.AuthorizationType.NONE,
    };

    // 各HTTPメソッドに Lambda をマッピング
    for (const method in props.methodToLambdaMap) {
      if (method === "OPTIONS") {
        // OPTIONSメソッドは認証なしで設定
        resource.addMethod(
          method,
          new apigateway.LambdaIntegration(props.methodToLambdaMap[method]),
          optionsMethodOptions
        );
      } else {
        resource.addMethod(
          method,
          new apigateway.LambdaIntegration(props.methodToLambdaMap[method]),
          methodOptions
        );
      }
    }

    // GETメソッドを /test/{userId} にも設定
    if (props.methodToLambdaMap["GET"]) {
      resourceWithId.addMethod(
        "GET",
        new apigateway.LambdaIntegration(props.methodToLambdaMap["GET"]),
        methodOptions
      );
    }

    // OPTIONSメソッドを /test/{userId} にも設定（認証なし）
    if (props.methodToLambdaMap["OPTIONS"] || props.methodToLambdaMap["GET"]) {
      resourceWithId.addMethod(
        "OPTIONS",
        new apigateway.LambdaIntegration(
          props.methodToLambdaMap["OPTIONS"] || props.methodToLambdaMap["GET"]
        ),
        optionsMethodOptions
      );
    }
  }
}
