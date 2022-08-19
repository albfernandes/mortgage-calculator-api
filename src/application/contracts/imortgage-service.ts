import { Mortgage } from "../../domain/entities/mortgage";
import { PaymentScheduleEnum } from "../enums/payment-schedule-enum";
import { Result } from "./result/result";

export interface IMortgageService {
  getPaymentPerSchedule(data: {
    propertyPrice: number;
    downPayment: number;
    annualInterestRate: number;
    amortizationPeriod: number;
    paymentSchedule: PaymentScheduleEnum;
  }): Result<Mortgage>;
}
