import { PaymentScheduleEnum } from "../enums/payment-schedule-enum";

export const PaymentsPerMonth: {
  [k in PaymentScheduleEnum]: number;
} = {
  [PaymentScheduleEnum.WEEKLY]: 4,
  [PaymentScheduleEnum.BIWEEKLY]: 2,
  [PaymentScheduleEnum.MONTHLY]: 1,
};
