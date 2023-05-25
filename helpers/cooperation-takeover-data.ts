import { CooperationOrderData } from "./cooperation-order-data";

export interface CooperationTakeoverData {
  recordId: number;
  bookingYear: number;
  bookingCode: number;
  documentTypeId: number;
  documentTypeName: string;
  documentTypeCode: string;
  cooperationOrder: CooperationOrderData;
  createdDate: string;
  cooperationTakeoverNumber: string;
  description: string;
  isProtected: boolean;
  modifiedBy: string;
  modifiedDate: string;
  isDeleted: boolean;
  status: string;
  bookedDate: string;
  erpId: number;
  erpCode: string;
  erpOrderNo: string;
  syncDate: string;
  code: string;

  cooperationTakeoverDisclaimerText?: string;
}

