import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { DynamoConstruct } from "../constructs/dynamo-construct";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { LambdaConstruct } from "../constructs/lambda-construct";
import { ApiGatewayConstruct } from "../constructs/api-gateway-construct";
// import { CognitoConstruct } from "../constructs/cognito-Construct";
export class Cdk2025ProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const knowledgeTableConstruct = new DynamoConstruct(
      this,
      "TableConstruct",
      {
        tableName: "knowledge",
        partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
      }
    );

    // const cognito = new CognitoConstruct(this, "Cognito");
    const getLambda = new LambdaConstruct(this, "GetLambda", {
      functionName: "GetKnowledge",
      handler: "index.handler",
      entry: "../../lambda/get/index.ts",
    });

    const postLambda = new LambdaConstruct(this, "PostLambda", {
      functionName: "PostKnowledge",
      handler: "index.handler",
      entry: "../../lambda/post/index.ts",
    });

    knowledgeTableConstruct.table.grantReadData(getLambda.lambdaFn);
    knowledgeTableConstruct.table.grantWriteData(postLambda.lambdaFn);

    new ApiGatewayConstruct(this, "TestApi", {
      apiName: "TestApi",
      route: "test",
      methodToLambdaMap: {
        GET: getLambda.lambdaFn,
        POST: postLambda.lambdaFn,
      },
      //  authorizer: cognito.authorizer,  
    });
  }
}
