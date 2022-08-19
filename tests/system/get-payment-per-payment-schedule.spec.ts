import faker from "faker";
import { HttpStatusCode } from "../../src/infrastructure/http/http-status-code";
import request from "supertest";
import { container } from "../../src/infrastructure/configurations/container";
import { ProcessHttpRequest } from "../../src/interface/api/process-http-request";
import { GetPaymentPerScheduleCommand } from "../../src/application/get-payment-per-schedule/get-payment-per-schedule-command";
import { PaymentScheduleEnum } from "../../src/application/enums/payment-schedule-enum";

describe("System", () => {
  describe("GetStockInformationRoute", () => {
    it("Should return 400 when request is invalid", async () => {
      // given
      const app = container.get(ProcessHttpRequest).configure();

      const expectedResult = {
        body: JSON.stringify({
          message: "Invalid Request",
          details: {
            propertyPrice: {
              message: "'propertyPrice' is required",
            },
            downPayment: {
              message: "'downPayment' is required",
            },
            annualInterestRate: {
              message: "'annualInterestRate' is required",
            },
            amortizationPeriod: {
              message: "'amortizationPeriod' is required",
            },
            paymentSchedule: {
              message: "'paymentSchedule' is required",
            },
          },
        }),
        statusCode: HttpStatusCode.BAD_REQUEST,
      };

      const stockCode = faker.random.word();

      // when
      const result = await request(app).get("/mortgage-service/api/v1/payment-schedule").query({ stockCode });

      // then
      expect(result.statusCode).toEqual(expectedResult.statusCode);
      expect(result.text).toEqual(expectedResult.body);
    });

    it("Should return 400 if down payment is bigger than the property price", async () => {
      // given
      const app = container.get(ProcessHttpRequest).configure();

      const expectedResult = {
        body: JSON.stringify({
          message: "Down payment is bigger than the property price",
        }),
        statusCode: HttpStatusCode.BAD_REQUEST,
      };

      const propertyPrice = faker.datatype.number();

      const query = new GetPaymentPerScheduleCommand({
        amortizationPeriod: 5,
        annualInterestRate: 5,
        downPayment: propertyPrice * 2,
        propertyPrice: propertyPrice,
        paymentSchedule: PaymentScheduleEnum.MONTHLY,
      });

      // when
      const result = await request(app)
        .get("/mortgage-service/api/v1/payment-schedule")
        .query({ ...query });

      // then
      expect(result.statusCode).toEqual(expectedResult.statusCode);
      expect(result.text).toEqual(expectedResult.body);
    });

    it("Should return 400 if down payment is not large enough", async () => {
      // given
      const app = container.get(ProcessHttpRequest).configure();

      const expectedResult = {
        body: JSON.stringify({
          message: "Down payment is not large enough",
        }),
        statusCode: HttpStatusCode.BAD_REQUEST,
      };

      const propertyPrice = faker.datatype.number();

      const query = new GetPaymentPerScheduleCommand({
        amortizationPeriod: 5,
        annualInterestRate: 5,
        downPayment: propertyPrice * 0.1,
        propertyPrice: propertyPrice,
        paymentSchedule: PaymentScheduleEnum.MONTHLY,
      });

      // when
      const result = await request(app)
        .get("/mortgage-service/api/v1/payment-schedule")
        .query({ ...query });

      // then
      expect(result.statusCode).toEqual(expectedResult.statusCode);
      expect(result.text).toEqual(expectedResult.body);
    });

    it("Should return 400 if amortization period is not 5 year increments between 5 and 30 years", async () => {
      // given
      const app = container.get(ProcessHttpRequest).configure();

      const expectedResult = {
        body: JSON.stringify({
          message: "Amortization period should be 5 year increments between 5 and 30 years",
        }),
        statusCode: HttpStatusCode.BAD_REQUEST,
      };

      const propertyPrice = faker.datatype.number();

      const query = new GetPaymentPerScheduleCommand({
        amortizationPeriod: faker.datatype.number({ max: 9, min: 6 }),
        annualInterestRate: 5,
        downPayment: propertyPrice * 0.3,
        propertyPrice: propertyPrice,
        paymentSchedule: PaymentScheduleEnum.MONTHLY,
      });

      // when
      const result = await request(app)
        .get("/mortgage-service/api/v1/payment-schedule")
        .query({ ...query });

      // then
      expect(result.statusCode).toEqual(expectedResult.statusCode);
      expect(result.text).toEqual(expectedResult.body);
    });

    it("Should return 200 and payment per payment schedule if the inputs are correct", async () => {
      // given
      const app = container.get(ProcessHttpRequest).configure();

      const expectedResult = {
        body: JSON.stringify({ paymentPerPaymentSchedule: 1825.1935182412751 }),
        statusCode: HttpStatusCode.SUCCESS,
      };

      const query = new GetPaymentPerScheduleCommand({
        amortizationPeriod: 30,
        annualInterestRate: 5,
        downPayment: 85000,
        propertyPrice: 425000,
        paymentSchedule: PaymentScheduleEnum.MONTHLY,
      });

      // when
      const result = await request(app)
        .get("/mortgage-service/api/v1/payment-schedule")
        .query({ ...query });

      // then
      expect(result.statusCode).toEqual(expectedResult.statusCode);
      expect(result.text).toEqual(expectedResult.body);
    });
  });
});
