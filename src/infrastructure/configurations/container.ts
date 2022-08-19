import { Container, decorate, injectable } from "inversify";
import * as Types from "./types";
import { Settings } from "./settings";
import { ProcessHttpRequest } from "../../interface/api/process-http-request";
import { BodyParserMiddleware } from "../../interface/api/middlewares/body-parser-middleware";
import { ErrorMiddleware } from "../../interface/api/middlewares/error-middleware";
import { Controller } from "tsoa";
import { MortgageController } from "../../interface/api/controllers/mortgage-controller";
import { MortgageService } from "../mortgage-service/mortgage-service";
import { GetPaymentPerScheduleCommandHandler } from "../../application/get-payment-per-schedule/get-payment-per-schedule-command-handler";

const container: Container = new Container();

decorate(injectable(), Controller);

// command handlers
container.bind(GetPaymentPerScheduleCommandHandler).toSelf();

// values
container.bind(Container).toConstantValue(container);
container.bind(Types.Envs).toConstantValue(process.env);

// infrastructure
container.bind(Settings).toSelf();
container.bind(MortgageService).toSelf();

// Interface
container.bind(ProcessHttpRequest).toSelf();
container.bind(BodyParserMiddleware).toSelf();
container.bind(ErrorMiddleware).toSelf();

// Controllers
container.bind(MortgageController).toSelf();

export { container, container as iocContainer };
