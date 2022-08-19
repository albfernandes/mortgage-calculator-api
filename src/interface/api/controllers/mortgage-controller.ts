import { inject, injectable } from "inversify";
import { Route, Controller, Tags, Get, Response, Query } from "tsoa";
import { PaymentScheduleEnum } from "../../../application/enums/payment-schedule-enum";
import { GetPaymentPerScheduleCommand } from "../../../application/get-payment-per-schedule/get-payment-per-schedule-command";
import { GetPaymentPerScheduleCommandHandler } from "../../../application/get-payment-per-schedule/get-payment-per-schedule-command-handler";
import { Mortgage } from "../../../domain/entities/mortgage";
import { HttpStatusCode } from "../../../infrastructure/http/http-status-code";
import { handleResult } from "../handle-result";
import { ErrorResult, SmallInt } from "../types";

@injectable()
@Route()
export class MortgageController extends Controller {
  private getPaymentPerScheduleCommandHandler: GetPaymentPerScheduleCommandHandler;

  constructor(
    @inject(GetPaymentPerScheduleCommandHandler)
    getPaymentPerScheduleCommandHandler: GetPaymentPerScheduleCommandHandler,
  ) {
    super();
    this.getPaymentPerScheduleCommandHandler = getPaymentPerScheduleCommandHandler;
  }

  /**
   * Retrivies payment per payment schedule.
   */
  @Tags("Payment per payment schedule")
  @Get("/v1/payment-schedule")
  @Response<ErrorResult>(HttpStatusCode.BAD_REQUEST)
  @Response<ErrorResult>(HttpStatusCode.INTERNAL_SERVER_ERROR)
  @Response<ErrorResult>(HttpStatusCode.NOT_FOUND)
  public async getPaymentPerPaymentSchedule(
    @Query() propertyPrice: number,
    @Query() downPayment: number,
    @Query() annualInterestRate: number,
    @Query() amortizationPeriod: SmallInt,
    @Query() paymentSchedule: PaymentScheduleEnum,
  ): Promise<Mortgage | ErrorResult> {
    const getPaymentPerScheduleCommand = new GetPaymentPerScheduleCommand({
      propertyPrice,
      downPayment,
      annualInterestRate,
      amortizationPeriod,
      paymentSchedule,
    });

    const result = await this.getPaymentPerScheduleCommandHandler.handle(getPaymentPerScheduleCommand);

    const { data, statusCode } = handleResult(result);

    this.setStatus(statusCode);

    return data;
  }
}
