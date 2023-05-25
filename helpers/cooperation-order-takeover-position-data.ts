import { CooperationOrderData } from "./cooperation-order-data";

export interface CooperationOrderTakeoverPositionData {
  recordId: number;
  cooperationOrderId: number;
  cooperationOrder: CooperationOrderData;
  status: string;
  position: number;
  workOrderOperationId: number;
  workOrderOperationCode: string;
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

  customerOrderErpOrderNumber?: string;
  customerOrderClientNumber?: string;
}
