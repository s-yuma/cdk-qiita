// import { Construct } from "constructs";
// import * as cognito from "aws-cdk-lib/aws-cognito";
// import * as apigateway from "aws-cdk-lib/aws-apigateway";
// import { Duration, RemovalPolicy } from "aws-cdk-lib";

// export class CognitoConstruct extends Construct {
//   public readonly userPool: cognito.UserPool;
//   public readonly authorizer: apigateway.CognitoUserPoolsAuthorizer;
//   public readonly userPoolClient: cognito.UserPoolClient;
//   public readonly hostedUiDomain: cognito.UserPoolDomain;

//   constructor(scope: Construct, id: string) {
//     super(scope, id);

//     // UserPool の作成
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
//       userPoolName: "MyAppUserPool",
//       removalPolicy: RemovalPolicy.DESTROY, // 開発環境用
//     });

//     // UserPoolClient の作成
//     this.userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
//       userPool: this.userPool,
//       generateSecret: false,
//       authFlows: {
//         userPassword: true,
//         userSrp: true,
//       },
//       // トークンの有効期限設定
//       accessTokenValidity: Duration.hours(24),
//       idTokenValidity: Duration.hours(24),
//       refreshTokenValidity: Duration.days(30),
//       oAuth: {
//         flows: {
//           // Authorization Code Grant に変更
//           authorizationCodeGrant: true,
//         },
//         scopes: [
//           cognito.OAuthScope.EMAIL,
//           cognito.OAuthScope.OPENID,
//           cognito.OAuthScope.PROFILE,
//         ],
//         callbackUrls: [
//           "https://dt8gbon99bxbs.cloudfront.net/index.html",
//         ],
//         logoutUrls: ["https://www.yahoo.co.jp",],
//       },
//     });

//     // Hosted UI Domain の作成
//     this.hostedUiDomain = new cognito.UserPoolDomain(this, "UserPoolDomain", {
//       userPool: this.userPool,
//       cognitoDomain: {
//         domainPrefix: "my-app-hosted-ui-demo",
//       },
//     });

//     // API Gateway Authorizer の作成
//     this.authorizer = new apigateway.CognitoUserPoolsAuthorizer(
//       this,
//       "Authorizer",
//       {
//         cognitoUserPools: [this.userPool],
//         identitySource: "method.request.header.Authorization",
//       }
//     );
//   }
// }
