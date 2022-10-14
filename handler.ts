import type { APIGatewayProxyEvent, Context } from "aws-lambda";
import awsServerlessExpress from "aws-serverless-express";
import * as http from "http";
import { container } from "./src/infrastructure/configurations/container";
import { ProcessHttpRequest } from "./src/interface/api/process-http-request";

const app = container.get(ProcessHttpRequest).configure();

const server = awsServerlessExpress.createServer(app);

export const handle = async (event: APIGatewayProxyEvent, context: Context): Promise<http.Server> => {
  return awsServerlessExpress.proxy(server, event, context);
};
