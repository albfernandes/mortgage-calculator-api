import { NonFunctionProperties } from "../contracts/types";
import { PaymentScheduleEnum } from "../enums/payment-schedule-enum";

export class GetPaymentPerScheduleCommand {
  public propertyPrice: number;
  public downPayment: number;
  public annualInterestRate: number;
  public amortizationPeriod: number;
  public paymentSchedule: PaymentScheduleEnum;

  public constructor(data: NonFunctionProperties<GetPaymentPerScheduleCommand>) {
    this.propertyPrice = data.propertyPrice;
    this.downPayment = data.downPayment;
    this.annualInterestRate = data.annualInterestRate;
    this.amortizationPeriod = data.amortizationPeriod;
    this.paymentSchedule = data.paymentSchedule;
  }
}
