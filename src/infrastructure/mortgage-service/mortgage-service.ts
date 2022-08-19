import { injectable } from "inversify";
import { IMortgageService } from "../../application/contracts/imortgage-service";
import { Result } from "../../application/contracts/result/result";
import { ResultError } from "../../application/contracts/result/result-error";
import { ResultSuccess } from "../../application/contracts/result/result-success";
import { PaymentScheduleEnum } from "../../application/enums/payment-schedule-enum";
import { PaymentsPerMonth } from "../../application/get-payment-per-schedule/payments-per-month-converter";
import { Mortgage } from "../../domain/entities/Mortgage";

const MONTHS_PER_YEAR = 12;
const PERCENT = 100;

@injectable()
export class MortgageService implements IMortgageService {
  public getPaymentPerSchedule(data: {
    propertyPrice: number;
    downPayment: number;
    annualInterestRate: number;
    amortizationPeriod: number;
    paymentSchedule: PaymentScheduleEnum;
  }): Result<Mortgage> {
    try {
      const p = data.propertyPrice - data.downPayment;
      const n = PaymentsPerMonth[data.paymentSchedule] * data.amortizationPeriod * MONTHS_PER_YEAR;
      const r = data.annualInterestRate / PERCENT / MONTHS_PER_YEAR;

      const mortgagePayment = (p * (r * (1 + r) ** n)) / ((1 + r) ** n - 1);

      return new ResultSuccess(new Mortgage({ paymentPerPaymentSchedule: mortgagePayment }));
    } catch (error) {
      return new ResultError("Failed to calculate payment per payment schedule");
    }
  }
}
