import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
export interface LambdaProps {
  functionName: string;
  handler: string;
  entry: string;
}

export class LambdaConstruct extends Construct {
  public readonly lambdaFn: lambda.Function;

  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);

    this.lambdaFn = new NodejsFunction(this, "LambdaFunction", {
      functionName: props.functionName,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: props.handler,
      entry: path.join(__dirname, props.entry), 
    });
  }
}
