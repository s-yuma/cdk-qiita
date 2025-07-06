// src/aws-exports.ts
import type { ResourcesConfig } from 'aws-amplify';

export const awsconfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: "ap-northeast-1_zMpG7hK5W",
      userPoolClientId: "4qqkag24v51e3llk20r5572emf",
      loginWith: {
        oauth: {
          domain: "my-app-hosted-ui-demo.auth.ap-northeast-1.amazoncognito.com",
          scopes: ["openid", "email", "profile"],
          redirectSignIn: ["https://main.d2l529um1j39do.amplifyapp.com"],
          redirectSignOut: ["https://www.yahoo.co.jp"],
          responseType: "code", // Authorization Code Grant用に変更
        },
      },
    },
  },
};
