import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PeriodSelectionComponent } from 'src/app/core/components/period-selection/period-selection.component';
import { DateFormatPipe } from 'src/app/core/pipes/date-format.pipe';
import {
  PeriodRangeEnum,
  getPeriodRange,
} from 'src/app/core/utils/startEndDates';
import { RightHeaderComponent } from 'src/app/right-header/right-header.component';

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DateFormatPipe,
    PeriodSelectionComponent,
    RightHeaderComponent,
  ],
})
export class ReportsPageComponent implements OnInit {
  reportTypesList = REPORT_TYPES_LIST;
  reportlistTypes = Object.keys(this.reportTypesList);
  selectedReportType: string = 'Profit and Loss';
  reportStartDate: string | undefined;
  reportEndDate: string | undefined;
  period: PeriodRangeEnum = PeriodRangeEnum.THIS_MONTH;
  constructor() {}
  getReportTypesArray(reportlistType: string) {
    //@ts-ignore
    return this.reportTypesList[reportlistType];
  }
  ngOnInit() {
    const periodRange = getPeriodRange(this.period);
    this.reportStartDate = periodRange.startDate;
    this.reportEndDate = periodRange.endDate;
  }

  onReportTypeSelected(selectedReportType: string) {
    this.selectedReportType = selectedReportType;
  }

  onStartDateChange(event: any) {
    this.reportStartDate = event.detail.value;
  }

  onEndDateChange(event: any) {
    this.reportEndDate = event.detail.value;
  }

  onPeriodSelect(period: PeriodRangeEnum) {
    this.period = period;
    const periodRange = getPeriodRange(this.period);
    this.reportStartDate = periodRange.startDate;
    this.reportEndDate = periodRange.endDate;
  }
}

export interface ReportTypesI {
  [ReportListTypeEnum.BUSINESS_OVERVIEW]: BusinessOverviewReportTypeEnum[];
  [ReportListTypeEnum.SALES]: SalesReportTypeEnum[];
  [ReportListTypeEnum.INVENTORY]: InventoryReportTypeEnum[];
  [ReportListTypeEnum.RECEIVABLES]: ReceivablesReportTypeEnum[];
  [ReportListTypeEnum.PAYMENTS_RECEIVED]: PaymentsReceivedReportTypeEnum[];
  [ReportListTypeEnum.PAYABLES]: PayablesEnumReportTypeEnum[];
  [ReportListTypeEnum.PURCHASES_AND_EXPENSES]: PurchasesAndExpensesReportTypeEnum[];
  [ReportListTypeEnum.TAXES]: TaxesReportTypeEnum[];
}

export enum ReportListTypeEnum {
  BUSINESS_OVERVIEW = 'Business Overview',
  SALES = 'Sales',
  INVENTORY = 'Inventory',
  RECEIVABLES = 'Receivables',
  PAYMENTS_RECEIVED = 'Payments Received',
  PAYABLES = 'Payables',
  PURCHASES_AND_EXPENSES = 'Purchases and Expenses',
  TAXES = 'Taxes',
}

export enum BusinessOverviewReportTypeEnum {
  PROFIT_AND_LOSS = 'Profit and Loss',
  PROFIT_AND_LOSS_SCHEDULE_III = 'Profit and Loss (Schedule III)',
  HORIZONTAL_PROFIT_AND_LOSS = 'Horizontal Profit and Loss',
  CASH_FLOW_STATEMENT = 'Cash Flow Statement',
  BALANCE_SHEET = 'Balance Sheet',
  HORIZONTAL_BALANCE_SHEET = 'Horizontal Balance Sheet',
  BALANCE_SHEET_SCHEDULE_III = 'Balance Sheet (Schedule III)',
  BUSINESS_PERFORMANCE_RATIOS = 'Business Performance Ratios',
  MOVEMENT_OF_EQUITY = 'Movement of Equity',
}

export enum SalesReportTypeEnum {
  SALES_BY_CUSTOMER = 'Sales by Customer',
  SALES_BY_ITEM = 'Sales by Item',
  SALES_BY_SALES_PERSON = 'Sales by Sales Person',
}

export enum InventoryReportTypeEnum {
  INVENTORY_SUMMARY = 'Inventory Summary',
  COMMITTED_STOCK_DETAILS = 'Committed Stock Details',
  INVENTORY_VALUATION_SUMMARY = 'Inventory Valuation Summary',
  FIFO_COST_LOT_TRACKING = 'FIFO Cost Lot Tracking',
  INVENTORY_AGING_SUMMARY = 'Inventory Aging Summary',
  PRODUCT_SALES_REPORT = 'Product Sales Report',
  STOCK_SUMMARY_REPORT = 'Stock Summary Report',
  ABC_CLASSIFICATION = 'ABC Classification',
}

export enum ReceivablesReportTypeEnum {
  CUSTOMER_BALANCES = 'Customer Balances',
  AR_AGING_SUMMARY = 'AR Aging Summary',
  AR_AGING_DETAILS = 'AR Aging Details',
  INVOICE_DETAILS = 'Invoice Details',
  CUSTOMER_BALANCE_SUMMARY = 'Customer Balance Summary',
  RECEIVABLE_SUMMARY = 'Receivable Summary',
  RECEIVABLE_DETAILS = 'Receivable Details',
}

export enum PaymentsReceivedReportTypeEnum {
  PAYMENTS_RECEIVED = 'Payments Received',
  TIME_TO_GET_PAID = 'Time to Get Paid',
  CREDIT_NOTE_DETAILS = 'Credit Note Details',
  REFUND_HISTORY = 'Refund History',
}

export enum PayablesEnumReportTypeEnum {
  VENDOR_BALANCES = 'Vendor Balances',
  VENDOR_BALANCE_SUMMARY = 'Vendor Balance Summary',
  AP_AGING_SUMMARY = 'AP Aging Summary',
  AP_AGING_DETAILS = 'AP Aging Details',
  BILLS_DETAILS = 'Bills Details',
  VENDOR_CREDITS_DETAILS = 'Vendor Credits Details',
  PAYMENTS_MADE = 'Payments Made',
  REFUND_HISTORY = 'Refund History',
  PAYABLE_SUMMARY = 'Payable Summary',
  PAYABLE_DETAILS = 'Payable Details',
}

export enum PurchasesAndExpensesReportTypeEnum {
  PURCHASES_BY_VENDOR = 'Purchases by Vendor',
  PURCHASES_BY_ITEM = 'Purchases by Item',
  EXPENSE_DETAILS = 'Expense Details',
  EXPENSES_BY_CATEGORY = 'Expenses by Category',
  EXPENSES_BY_CUSTOMER = 'Expenses by Customer',
  EXPENSES_BY_PROJECT = 'Expenses by Project',
  EXPENSES_BY_EMPLOYEE = 'Expenses by Employee',
  BILLABLE_EXPENSE_DETAILS = 'Billable Expense Details',
}

export enum TaxesReportTypeEnum {
  TAX_SUMMARY = 'Tax Summary',
  TDS_SUMMARY = 'TDS Summary',
  FORM_NO_27EQ = 'Form No. 27EQ',
  INVOICE_FURNISHING_FACILITY = 'Invoice Furnishing Facility (IFF)',
  PMT_06_SELF_ASSESSMENT_BASIS = 'PMT-06 (Self Assessment Basis)',
  GSTR_3B_SUMMARY = 'GSTR-3B Summary',
  SUMMARY_OF_OUTWARD_SUPPLIES = 'Summary of Outward Supplies',
  SUMMARY_OF_INWARD_SUPPLIES = 'Summary of Inward Supplies',
  SELF_INVOICE_SUMMARY = 'Self Invoice Summary',
  ANNUAL_SUMMARY_GSTR_9 = 'Annual Summary (GSTR-9)',
}

export const REPORT_TYPES_LIST: ReportTypesI = {
  [ReportListTypeEnum.BUSINESS_OVERVIEW]: Object.values(
    BusinessOverviewReportTypeEnum
  ),
  [ReportListTypeEnum.SALES]: Object.values(SalesReportTypeEnum),
  [ReportListTypeEnum.INVENTORY]: Object.values(InventoryReportTypeEnum),
  [ReportListTypeEnum.RECEIVABLES]: Object.values(ReceivablesReportTypeEnum),
  [ReportListTypeEnum.PAYMENTS_RECEIVED]: Object.values(
    PaymentsReceivedReportTypeEnum
  ),
  [ReportListTypeEnum.PAYABLES]: Object.values(PayablesEnumReportTypeEnum),
  [ReportListTypeEnum.PURCHASES_AND_EXPENSES]: Object.values(
    PurchasesAndExpensesReportTypeEnum
  ),
  [ReportListTypeEnum.TAXES]: Object.values(TaxesReportTypeEnum),
};
