import { NonFunctionProperties } from "../../application/contracts/types";

export class Mortgage {
  public paymentPerPaymentSchedule: number;

  constructor(data: NonFunctionProperties<Mortgage>) {
    this.paymentPerPaymentSchedule = data.paymentPerPaymentSchedule;
  }
}
