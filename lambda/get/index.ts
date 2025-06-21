import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export const handler = async (event: APIGatewayProxyEvent) => {
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
      body: JSON.stringify({ message: "Item not found" }),
    };
  }

  const data = unmarshall(result.Item);

  // 🔧 tagsがSetなら配列に変換
  if (data.tags instanceof Set) {
    data.tags = Array.from(data.tags);
  }
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data),
      };
    } else {
      // 🔁 全件取得
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
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(items),
      };
    }
  } catch (error) {
    console.error("Error in Lambda:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error }),
    };
  }
};
