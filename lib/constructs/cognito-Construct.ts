// import { Construct } from "constructs";
// import * as cognito from "aws-cdk-lib/aws-cognito";
// import * as apigateway from "aws-cdk-lib/aws-apigateway";

// export class CognitoConstruct extends Construct {
//     public readonly userPool: cognito.UserPool;
//     public readonly authorizer: apigateway.CognitoUserPoolsAuthorizer;
//     public readonly userPoolClient: cognito.UserPoolClient;
//     public readonly hostedUiDomain: cognito.UserPoolDomain;

//   constructor(scope: Construct, id: string) {
//     super(scope, id);

//     this.userPool = new cognito.UserPool(this, "UserPool", {
//       selfSignUpEnabled: true,
//       signInAliases: { email: true },
//       autoVerify: { email: true },
//       passwordPolicy: {
//         minLength: 8,
//         requireLowercase: true,
//         requireUppercase: true,
//         requireDigits: true,
//       },
//     });

//     const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
//       userPool: this.userPool,
//       generateSecret: false,
//       authFlows: {
//         userPassword: true,
//       },
//       oAuth: {
//         flows: {
//           implicitCodeGrant: true,
//         },
//         scopes: [
//           cognito.OAuthScope.EMAIL,
//           cognito.OAuthScope.OPENID,
//           cognito.OAuthScope.PROFILE,
//         ],
//         callbackUrls: [
//           "https://main.d2l529um1j39do.amplifyapp.com", // ← 実際のフロントエンドURLに変更
//         ],
//         logoutUrls: ["https://www.yahoo.co.jp"],
//       },
//     });

//     // Hosted UI 用のドメイン
//     this.hostedUiDomain = new cognito.UserPoolDomain(this, "UserPoolDomain", {
//         userPool: this.userPool,
//         cognitoDomain: {
//           domainPrefix: "my-app-hosted-ui-demo", // ← ユニークに
//         },
//       });
  
//       // API Gateway Authorizer
//       this.authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, "Authorizer", {
//         cognitoUserPools: [this.userPool],
//       });

    
//   }
// }
