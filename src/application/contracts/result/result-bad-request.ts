import { ResultStatusEnum } from "./result-status-enum";

export class ResultBadRequest {
  public readonly errorMessage: string;

  public readonly isError: true = true;

  public readonly status: ResultStatusEnum.BAD_REQUEST = ResultStatusEnum.BAD_REQUEST;

  public constructor(errorMessage: string) {
    this.errorMessage = errorMessage;
  }
}
