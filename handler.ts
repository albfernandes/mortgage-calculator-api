import type { APIGatewayProxyEvent, Context } from "aws-lambda";
import "reflect-metadata";
import serverless from "serverless-http";
import { container } from "./src/infrastructure/configurations/container";
import { ProcessHttpRequest } from "./src/interface/api/process-http-request";

const app = container.get(ProcessHttpRequest).configure();

const lambdaServer = serverless(app);

export const handle = async (event: APIGatewayProxyEvent, context: Context): Promise<Object> => {
  const result = await lambdaServer(event, context);
  return result;
};
