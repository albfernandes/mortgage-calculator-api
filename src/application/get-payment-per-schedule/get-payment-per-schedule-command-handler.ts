import { injectable, inject } from "inversify";
import { Mortgage } from "../../domain/entities/mortgage";
import { Settings } from "../../infrastructure/configurations/settings";
import { MortgageService } from "../../infrastructure/mortgage-service/mortgage-service";
import { CommandHandler } from "../contracts/command-handler";
import { Result } from "../contracts/result/result";
import { ResultBadRequest } from "../contracts/result/result-bad-request";
import { GetPaymentPerScheduleCommand } from "./get-payment-per-schedule-command";

@injectable()
export class GetPaymentPerScheduleCommandHandler implements CommandHandler<GetPaymentPerScheduleCommand, Mortgage> {
  private readonly mortgageService: MortgageService;
  private readonly settings: Settings;

  public constructor(@inject(MortgageService) mortgageService: MortgageService, @inject(Settings) settings: Settings) {
    this.mortgageService = mortgageService;
    this.settings = settings;
  }

  public async handle(command: GetPaymentPerScheduleCommand): Promise<Result<Mortgage>> {
    if (command.downPayment < command.propertyPrice * this.settings.propertyPriceMinimunDownPayment) {
      return new ResultBadRequest("Down payment is not large enough");
    }

    if (command.downPayment > command.propertyPrice) {
      return new ResultBadRequest("Down payment is bigger than the property price");
    }

    if (command.amortizationPeriod % 5 !== 0 || command.amortizationPeriod > 30) {
      return new ResultBadRequest("Amortization period should be 5 year increments between 5 and 30 years");
    }

    const getPaymentPerScheduleResult = this.mortgageService.getPaymentPerSchedule({ ...command });

    return getPaymentPerScheduleResult;
  }
}
