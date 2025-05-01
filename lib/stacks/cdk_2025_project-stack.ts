import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DynamoConstruct } from '../constructs/dynamo-construct';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
export class Cdk2025ProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new DynamoConstruct(this, "TableConsttruct", {
      tableName: "knowledge",
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    })

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'Cdk2025ProjectQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
