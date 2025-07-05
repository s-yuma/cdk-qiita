import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event: any) => {
  const body = JSON.parse(event.body);

  const { userId, title, description, content, author, date, tags } = body;

  try {
    const command = new PutItemCommand({
      TableName: "knowledge",
      Item: {
        userId: { S: userId.toString() },
        title: { S: title },
        description: { S: description },
        content: { S: content },
        author: { S: author },
        date: { S: date },
        tags: { SS: tags },
      },
    });

    await client.send(command);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // ← これを追加！
        "Access-Control-Allow-Headers": "Content-Type", // ← 必要ならこれも
      },
      body: JSON.stringify({ message: "データを追加" }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        // "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "*", // ← これを追加！
        // "Access-Control-Allow-Headers": "Content-Type", // ← 必要ならこれも
        "Access-Control-Allow-Origin":
          "https://main.d2l529um1j39do.amplifyapp.com",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      },
      body: JSON.stringify({ error: "データの追加に失敗しました" }),
    };
  }
};
