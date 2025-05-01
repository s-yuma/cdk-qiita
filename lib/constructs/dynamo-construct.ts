import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from 'aws-cdk-lib';


export interface DynamoTableProps {
  tableName: string;
  partitionKey: { name: string; type: dynamodb.AttributeType };
  sortKey?: { name: string; type: dynamodb.AttributeType };
  billingMode?: dynamodb.BillingMode;
}

export class DynamoConstruct extends Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props: DynamoTableProps) {
    super(scope, id);
    
    this.table = new dynamodb.Table(this, 'DynamoTable', {
        tableName: props.tableName,
        partitionKey: props.partitionKey,
        sortKey: props.sortKey,
        billingMode: props.billingMode ?? dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: RemovalPolicy.DESTROY,
    })
}
}