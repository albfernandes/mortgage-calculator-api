import type { APIGatewayProxyEvent, Context } from "aws-lambda";
import { createServer, proxy, Response } from "aws-serverless-express";
import { Server } from "http";
import "reflect-metadata";
import { container } from "./src/infrastructure/configurations/container";
import { ProcessHttpRequest } from "./src/interface/api/process-http-request";

const app = container.get(ProcessHttpRequest).configure();

const lambdaServer = createServer(app);

const beforeExit = async (lambdaServer: Server): Promise<void> => {
  lambdaServer.removeAllListeners();
  lambdaServer.close();
};

export const handle = async (event: APIGatewayProxyEvent, context: Context): Promise<Response> => {
  return proxy(lambdaServer, event, context, "PROMISE").promise.then(
    async (result: Response) => {
      await beforeExit(lambdaServer);
      return result;
    },
    async (error: Error) => {
      await beforeExit(lambdaServer);
      return Promise.reject(error);
    },
  );
};
