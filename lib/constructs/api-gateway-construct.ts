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

    // API Gateway 作成
    this.api = new apigateway.RestApi(this, "RestApi", {
      restApiName: props.apiName,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["Content-Type"],
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

    // OPTIONS メソッドを明示的に追加（CORS対応）
    resource.addMethod(
      "OPTIONS",
      new apigateway.MockIntegration({
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Headers": "'Content-Type'",
              "method.response.header.Access-Control-Allow-Origin": "'*'",
              "method.response.header.Access-Control-Allow-Methods": "'GET,POST,OPTIONS'",
            },
            responseTemplates: {
              "application/json": "",
            },
          },
        ],
        passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
        requestTemplates: {
          "application/json": '{"statusCode": 200}',
        },
      }),
      {
        methodResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Origin": true,
              "method.response.header.Access-Control-Allow-Methods": true,
            },
          },
        ],
      }
    );
  }
}
