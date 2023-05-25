import { CooperationOrderData } from "./cooperation-order-data";

export interface CooperationOrderIssuePositionData {
  recordId: number;
  cooperationOrderId: number;
  cooperationOrder: CooperationOrderData;
  status: string;
  position: number;
  workOrderOperationId: number;
  workOrderOperationCode: string;
  workOrderOperationExecutionPosition: number;
  workOrderOperationIsFirstOperation: boolean;
  previousOperationRealQuantity: number;
  productId: number;
  productCode: string;
  productName: string;
  quantityOrder: number;
  quantityIssue: number;
  quantityTakeover: number;
  quantityToIssue: number;
  quantityIssued: number;
  quantityTakeovered: number;
  quantityToTakeover: number;
  description: string;
  lowestAllowedQuantity: number;
}
