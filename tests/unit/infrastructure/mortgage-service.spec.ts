import { ResultSuccess } from "../../../src/application/contracts/result/result-success";
import { PaymentScheduleEnum } from "../../../src/application/enums/payment-schedule-enum";
import { Mortgage } from "../../../src/domain/entities/Mortgage";
import { MortgageService } from "../../../src/infrastructure/mortgage-service/mortgage-service";

const createService = (): MortgageService => {
  return new MortgageService();
};

describe("Unit", () => {
  describe("Infrastructure", () => {
    describe("MortgageService", () => {
      it("Should return a valid Mortgage entity", async () => {
        // given
        const serviceInput = {
          propertyPrice: 425000,
          downPayment: 85000,
          annualInterestRate: 5,
          amortizationPeriod: 30,
          paymentSchedule: PaymentScheduleEnum.MONTHLY,
        };

        const service = createService();

        const expects = new ResultSuccess(new Mortgage({ paymentPerPaymentSchedule: 1825.1935182412751 }));

        // when
        const result = service.getPaymentPerSchedule(serviceInput);

        // then
        expect(result).toEqual(expects);
      });
    });
  });
});
