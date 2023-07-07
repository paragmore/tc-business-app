import {
  endOfDay,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  endOfYesterday,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  startOfYesterday,
  subMonths,
  subQuarters,
  subWeeks,
  subYears,
} from 'date-fns';

export const getPeriodRange = (range: PeriodRangeEnum) => {
  const today = startOfDay(new Date());
  let startDate: Date;
  let endDate: Date;

  switch (range) {
    case PeriodRangeEnum.TODAY:
      startDate = today;
      endDate = endOfDay(today);
      break;
    case PeriodRangeEnum.THIS_WEEK:
      startDate = startOfWeek(today);
      endDate = endOfWeek(today);
      break;
    case PeriodRangeEnum.THIS_MONTH:
      startDate = startOfMonth(today);
      endDate = endOfMonth(today);
      break;
    case PeriodRangeEnum.THIS_QUARTER:
      startDate = startOfQuarter(today);
      endDate = endOfQuarter(today);
      break;
    case PeriodRangeEnum.THIS_YEAR:
      startDate = startOfYear(today);
      endDate = endOfYear(today);
      break;
    case PeriodRangeEnum.YEAR_TO_DATE:
      startDate = startOfYear(today);
      endDate = today;
      break;
    case PeriodRangeEnum.YESTERDAY:
      startDate = startOfYesterday();
      endDate = endOfYesterday();
      break;
    case PeriodRangeEnum.PREVIOUS_WEEK:
      startDate = startOfWeek(subWeeks(today, 1));
      endDate = endOfWeek(subWeeks(today, 1));
      break;
    case PeriodRangeEnum.PREVIOUS_MONTH:
      startDate = startOfMonth(subMonths(today, 1));
      endDate = endOfMonth(subMonths(today, 1));
      break;
    case PeriodRangeEnum.PREVIOUS_QUARTER:
      startDate = startOfQuarter(subQuarters(today, 1));
      endDate = endOfQuarter(subQuarters(today, 1));
      break;
    case PeriodRangeEnum.PREVIOUS_YEAR:
      startDate = startOfYear(subYears(today, 1));
      endDate = endOfYear(subYears(today, 1));
      break;
    default:
      startDate = today;
      endDate = endOfDay(today);
      break;
  }

  return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
};

export enum PeriodRangeEnum {
  TODAY = 'Today',
  THIS_WEEK = 'This Week',
  THIS_MONTH = 'This Month',
  THIS_QUARTER = 'This Quarter',
  THIS_YEAR = 'This Year',
  YEAR_TO_DATE = 'Year To Date',
  YESTERDAY = 'Yesterday',
  PREVIOUS_WEEK = 'Previous Week',
  PREVIOUS_MONTH = 'Previous Month',
  PREVIOUS_QUARTER = 'Previous Quarter',
  PREVIOUS_YEAR = 'Previous Year',
}
