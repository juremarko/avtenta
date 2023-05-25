
export interface CooperationOrderAnalyticsData {
  recordId?: number;
  workOrderId?: number;
  workplaceType?: string;
  executionPosition?: number;
  quantityPlanned?: number;
  quantityOrdered?: number;
  quantityToOrder?: number;
  quantityIssued?: number;
  quantityToIssue?: number;
  quantityTakeovered?: number;
  quantityToTakeover?: number;
  status?: string;
  code?: string;
  description?: string;
  isLastOperation?: boolean;
  resourceId?: number;
  resourceCode?: string;
  resourceName?: string;
  workplaceId?: number;
  workplaceCode?: string;
  workplaceName?: string;
  productId?: number;
  productCode?: string;
  productName?: string;
  unitOfMeasurementId?: number;
  unitOfMeasurementCode?: string;
  unitOfMeasurementName?: string;
  productionOrderId?: number;
  productionOrderCode?: string;
  customerOrderId?: number;
  customerOrderCode?: string;
  cooperantProductionTime?: number;
  cooperationOrderCodes?: string;
}