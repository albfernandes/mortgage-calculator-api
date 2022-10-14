import type { APIGatewayProxyEvent } from "aws-lambda";

export const handle = async (event: APIGatewayProxyEvent) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event,
      },
      null,
      2,
    ),
  };
};