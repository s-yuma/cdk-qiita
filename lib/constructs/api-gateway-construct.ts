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

    this.api = new apigateway.RestApi(this, "RestApi", {
      restApiName: props.apiName,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["Content-Type"],
      },
    });

    const resource = this.api.root.addResource(props.route);
    const resourceWithId = resource.addResource("{userId}");

    // 各メソッドを /{route} に追加
    for (const method in props.methodToLambdaMap) {
      resource.addMethod(
        method,
        new apigateway.LambdaIntegration(props.methodToLambdaMap[method]),
        props.authorizer ? { authorizer: props.authorizer } : undefined
      );
    }

    // GETのみ /{route}/{id} にも追加
    if (props.methodToLambdaMap["GET"]) {
      resourceWithId.addMethod(
        "GET",
        new apigateway.LambdaIntegration(props.methodToLambdaMap["GET"]),
        props.authorizer ? { authorizer: props.authorizer } : undefined
      );
    }
  }
}
