
export interface CooperationIssuePositionData {
  recordId: number;
  cooperationIssueId: number;
  cooperationIssueCode: string;
  cooperationOrderId: number;
  cooperationOrderCode: string;
  workOrderOperationId: number;
  workOrderOperationCode: string;
  workOrderOperationPosition: number;
  nextWorkOrderOperationId: number;
  nextWorkOrderOperationCode: string;
  nextWorkOrderOperationPosition: number;
  status: string;
  position: number;
  productId: number;
  productCode: string;
  productName: string;
  productUnitOfMeasureCode: string;
  productUnitOfMeasureName: string;
  productWeight: number;
  quantity: number;
  positionWeight: number;
  createdDate: string;
  modifiedDate: string;
  modifiedBy: string;
  isDeleted: boolean;
  description: string;

  customerOrderErpOrderNumber?: string;
  customerOrderClientNumber?: string;
}