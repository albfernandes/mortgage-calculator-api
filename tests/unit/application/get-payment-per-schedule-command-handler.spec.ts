import faker from "faker";
import { ResultBadRequest } from "../../../src/application/contracts/result/result-bad-request";
import { NonFunctionProperties } from "../../../src/application/contracts/types";
import { PaymentScheduleEnum } from "../../../src/application/enums/payment-schedule-enum";
import { GetPaymentPerScheduleCommand } from "../../../src/application/get-payment-per-schedule/get-payment-per-schedule-command";
import { GetPaymentPerScheduleCommandHandler } from "../../../src/application/get-payment-per-schedule/get-payment-per-schedule-command-handler";
import { Mortgage } from "../../../src/domain/entities/mortgage";
import { Settings } from "../../../src/infrastructure/configurations/settings";
import { MortgageService } from "../../../src/infrastructure/mortgage-service/mortgage-service";

interface MockDependencies {
  getPaymentPerSchedule?: Function;
}

const propertyPriceMinimunDownPayment = 0.2;

const generateCommand = (
  data: Partial<NonFunctionProperties<GetPaymentPerScheduleCommand>>,
): GetPaymentPerScheduleCommand => {
  return new GetPaymentPerScheduleCommand({
    propertyPrice: data.propertyPrice ?? faker.datatype.number(),
    downPayment: data.downPayment ?? faker.datatype.number(),
    annualInterestRate: data.annualInterestRate ?? faker.datatype.number(),
    amortizationPeriod: data.amortizationPeriod ?? faker.datatype.number(),
    paymentSchedule: data.paymentSchedule ?? PaymentScheduleEnum.MONTHLY,
  });
};

const createCommandHandlerInstance = (mockDependencies: MockDependencies): GetPaymentPerScheduleCommandHandler => {
  const mortgageService = {
    getPaymentPerSchedule: mockDependencies.getPaymentPerSchedule,
  } as unknown as MortgageService;

  const settings = {
    apiPort: 3000,
    propertyPriceMinimunDownPayment: propertyPriceMinimunDownPayment,
  } as Settings;

  return new GetPaymentPerScheduleCommandHandler(mortgageService, settings);
};

describe("Unit", () => {
  describe("Application", () => {
    describe("GetPaymentPerScheduleCommandHandler", () => {
      it("Should return an error when down payment is not large enough", async () => {
        // given

        const propertyPrice = faker.datatype.number();

        const command = generateCommand({
          downPayment: propertyPrice * (propertyPriceMinimunDownPayment * 0.5),
          propertyPrice: propertyPrice,
          amortizationPeriod: 5,
        });

        const dependencies: MockDependencies = {
          getPaymentPerSchedule: jest.fn(),
        };

        const commandHandler = createCommandHandlerInstance(dependencies);

        const expects = {
          result: new ResultBadRequest("Down payment is not large enough"),
        };

        // when
        const result = await commandHandler.handle(command);

        // then
        expect(result).toEqual(expects.result);
      });

      it("Should return an error when down payment is bigger than the property price", async () => {
        // given

        const propertyPrice = faker.datatype.number();

        const command = generateCommand({
          downPayment: propertyPrice * 2,
          propertyPrice: propertyPrice,
          amortizationPeriod: 5,
        });

        const dependencies: MockDependencies = {
          getPaymentPerSchedule: jest.fn(),
        };

        const commandHandler = createCommandHandlerInstance(dependencies);

        const expects = {
          result: new ResultBadRequest("Down payment is bigger than the property price"),
        };

        // when
        const result = await commandHandler.handle(command);

        // then
        expect(result).toEqual(expects.result);
      });

      it("Should return an error when amortization period should be 5 year increments between 5 and 30 years", async () => {
        // given

        const propertyPrice = faker.datatype.number();

        const command = generateCommand({
          amortizationPeriod: faker.datatype.number({ min: 6, max: 9 }),
          downPayment: propertyPrice,
          propertyPrice,
        });

        const dependencies: MockDependencies = {
          getPaymentPerSchedule: jest.fn(),
        };

        const commandHandler = createCommandHandlerInstance(dependencies);

        const expects = {
          result: new ResultBadRequest("Amortization period should be 5 year increments between 5 and 30 years"),
        };

        // when
        const result = await commandHandler.handle(command);

        // then
        expect(result).toEqual(expects.result);
      });

      it("Should return a result success with an mortgage entity when inputs are correct", async () => {
        // given

        const getPaymentPerScheduleResult = new Mortgage({ paymentPerPaymentSchedule: 1825.1935182412751 });

        const propertyPrice = faker.datatype.number({ min: 50000, max: 200000 });

        const command = generateCommand({
          paymentSchedule: PaymentScheduleEnum.MONTHLY,
          amortizationPeriod: 5,
          downPayment: propertyPrice,
          propertyPrice,
        });

        const dependencies: MockDependencies = {
          getPaymentPerSchedule: jest.fn().mockReturnValue(getPaymentPerScheduleResult),
        };

        const commandHandler = createCommandHandlerInstance(dependencies);

        const expects = {
          result: getPaymentPerScheduleResult,
        };

        // when
        const result = await commandHandler.handle(command);

        // then
        expect(result).toEqual(expects.result);
      });
    });
  });
});
