// src/aws-exports.ts
export const awsConfig = {
  Auth: {
    region: "ap-northeast-1",
    userPoolId: "ap-northeast-1_zMpG7hK5W",
    userPoolWebClientId: "4qqkag24v51e3llk20r5572emf",
    oauth: {
      domain: "my-app-hosted-ui-demo.auth.ap-northeast-1.amazoncognito.com",
      scope: ["openid", "email", "profile"],
      redirectSignIn: "https://main.d2l529um1j39do.amplifyapp.com",
      redirectSignOut: "https://www.yahoo.co.jp",
      responseType: "token", // ← implicitCodeGrantを使っているので
    },
  },
};
