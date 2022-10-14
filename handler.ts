import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event,
    }),
  };

  return response;
};
