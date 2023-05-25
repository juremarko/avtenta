export interface WarehouseTakeoverPositionData {
  recordId: number;
  supplierOrderId: number;
  position: number;
  productId: number;
  productCode: string;
  productName: string;
  description: string;
  quantity: number;
  quantityTakeovered: number;
  quantityToTakeover: number;
  createdDate: string;
  deliveryDate?: any;
  deliveryDateConfirmed?: any;
  modifiedDate: string;
  modifiedBy: string;
  salesPrice?: number;
  status: number;
  supplierOrderCode: string;
  supplierId: number;
  supplierCode: string;
  supplierName: string;
  lotTrackingId: number;
  lotTrackingCode: string;
  serialNumberId: number;
  serialNumberCode: string;
  productProductQualityCode: string;
}
