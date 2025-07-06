import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

// CORSヘッダーを共通化
const getCorsHeaders = () => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent",
  "Access-Control-Allow-Credentials": "true",
  "Content-Type": "application/json",
});

export const handler = async (event: APIGatewayProxyEvent) => {
  console.log("Event:", JSON.stringify(event, null, 2));

  // OPTIONSリクエストの処理（プリフライトリクエスト）
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: "",
    };
  }

  const userId = event.pathParameters?.userId;
  console.log("userId", userId);

  try {
    if (userId) {
      const result = await client.send(
        new GetItemCommand({
          TableName: "knowledge",
          Key: {
            userId: { S: userId },
          },
        })
      );

      if (!result.Item) {
        return {
          statusCode: 404,
          headers: getCorsHeaders(),
          body: JSON.stringify({ message: "Item not found" }),
        };
      }

      const data = unmarshall(result.Item);

      if (data.tags instanceof Set) {
        data.tags = Array.from(data.tags);
      }
      return {
        statusCode: 200,
        headers: getCorsHeaders(),
        body: JSON.stringify(data),
      };
    } else {
      const result = await client.send(
        new ScanCommand({
          TableName: "knowledge",
        })
      );

      const items = result.Items?.map((item) => {
        const data = unmarshall(item);
        if (data.tags instanceof Set) {
          data.tags = Array.from(data.tags);
        }
        return data;
      });

      return {
        statusCode: 200,
        headers: getCorsHeaders(),
        body: JSON.stringify(items || []),
      };
    }
  } catch (error) {
    console.error("Error in Lambda:", error);
    return {
      statusCode: 500,
      headers: getCorsHeaders(),
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};
