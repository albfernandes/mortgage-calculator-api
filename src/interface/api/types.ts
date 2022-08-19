export interface ErrorResult {
  message: string;
}

import { FieldErrors } from "tsoa";

export interface ValidationErrorResult extends ErrorResult {
  details: FieldErrors;
}

/**
 * @isInt
 * @minimum 0
 * @maximum 1000
 */
export type SmallInt = number;
