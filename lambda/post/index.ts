import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const client = new DynamoDBClient({});

const ALLOWED_ORIGIN = "https://dt8gbon99bxbs.cloudfront.net";

// CORSヘッダーを共通化
const getCorsHeaders = () => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent",
  "Access-Control-Allow-Credentials": "true",
  "Content-Type": "application/json",
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Event:", JSON.stringify(event, null, 2));
  
  // OPTIONSリクエストの処理（プリフライトリクエスト）
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: "",
    };
  }

  try {
    // リクエストボディの解析
    if (!event.body) {
      return {
        statusCode: 400,
        headers: getCorsHeaders(),
        body: JSON.stringify({ error: "リクエストボディが必要です" }),
      };
    }

    const body = JSON.parse(event.body);
    const { userId, title, description, content, author, date, tags } = body;

    // 必須フィールドの検証
    if (!userId || !title || !description || !content || !author || !date || !tags) {
      return {
        statusCode: 400,
        headers: getCorsHeaders(),
        body: JSON.stringify({ error: "必須フィールドが不足しています" }),
      };
    }

    const command = new PutItemCommand({
      TableName: "knowledge",
      Item: {
        userId: { S: userId.toString() },
        title: { S: title },
        description: { S: description },
        content: { S: content },
        author: { S: author },
        date: { S: date },
        tags: { SS: Array.isArray(tags) ? tags : [tags] }, // 配列でない場合の対応
      },
    });

    await client.send(command);

    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: JSON.stringify({ message: "データを追加しました" }),
    };
  } catch (error) {
    console.error("Error in Lambda:", error);
    return {
      statusCode: 500,
      headers: getCorsHeaders(),
      body: JSON.stringify({ 
        error: "データの追加に失敗しました",
        details: error instanceof Error ? error.message : String(error)
      }),
    };
  }
};