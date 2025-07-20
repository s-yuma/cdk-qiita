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

    const FRONTEND_ORIGIN = "https://main.dt7vykrqikg9n.amplifyapp.com";

    // REST API 本体
    this.api = new apigateway.RestApi(this, "RestApi", {
      restApiName: props.apiName,
      defaultCorsPreflightOptions: {
        allowOrigins: [FRONTEND_ORIGIN],
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          "Content-Type",
          "Authorization",
          "X-Amz-Date",
          "X-Api-Key",
          "X-Amz-Security-Token",
          "X-Amz-User-Agent",
        ],
        allowCredentials: true, // 認証情報の送信を許可
      },
    });

    // API Gateway の GatewayResponse (4xx/5xx) にも CORS を追加
    new apigateway.GatewayResponse(this, "Default4xxGatewayResponse", {
      restApi: this.api,
      type: apigateway.ResponseType.DEFAULT_4XX,
      responseHeaders: {
        "Access-Control-Allow-Origin": `'${FRONTEND_ORIGIN}'`,
        "Access-Control-Allow-Headers":
          "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
        "Access-Control-Allow-Methods": "'GET,POST,OPTIONS'",
        "Access-Control-Allow-Credentials": "'true'",
      },
    });

    new apigateway.GatewayResponse(this, "Default5xxGatewayResponse", {
      restApi: this.api,
      type: apigateway.ResponseType.DEFAULT_5XX,
      responseHeaders: {
        "Access-Control-Allow-Origin": `'${FRONTEND_ORIGIN}'`,
        "Access-Control-Allow-Headers":
          "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
        "Access-Control-Allow-Methods": "'GET,POST,OPTIONS'",
        "Access-Control-Allow-Credentials": "'true'",
      },
    });

    // Cognito Authorizer をこの RestApi にバインド
    if (props.authorizer && "restApi" in props.authorizer) {
      // @ts-ignore
      props.authorizer.restApi = this.api;
    }

    // /<route>
    const resource = this.api.root.addResource(props.route);
    // /<route>/{userId}
    const resourceWithId = resource.addResource("{userId}");

    // 認可設定
    const methodOptions: apigateway.MethodOptions | undefined = props.authorizer
      ? {
          authorizer: props.authorizer,
          authorizationType: apigateway.AuthorizationType.COGNITO,
        }
      : undefined;

    // HTTP メソッドと Lambda を紐付け
    for (const [method, fn] of Object.entries(props.methodToLambdaMap)) {
      resource.addMethod(
        method,
        new apigateway.LambdaIntegration(fn),
        methodOptions
      );
    }

    // /<route>/{userId} の GET
    if (props.methodToLambdaMap["GET"]) {
      resourceWithId.addMethod(
        "GET",
        new apigateway.LambdaIntegration(props.methodToLambdaMap["GET"]),
        methodOptions
      );
    }
  }
}
