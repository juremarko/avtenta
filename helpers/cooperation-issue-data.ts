import { CooperationOrderData } from './cooperation-order-data';

export interface CooperationIssueData {
  recordId: number;
  code: string;
  bookingYear: number;
  bookingCode: number;
  cooperationIssueNumber: string;
  description: string;
  status: string;
  documentTypeId: number;
  documentTypeCode: string;
  documentTypeName: string;
  documentTypeDescription: string;
  cooperationOrderId: number;
  cooperationOrderCode: string;
  cooperationOrder: CooperationOrderData;
  modifiedBy: string;
  modifiedDate: string;
  bookedDate: string;
  issueWeight: number;
  issueQuantity: number;

  cooperationIssueDisclaimerText?: string;
}