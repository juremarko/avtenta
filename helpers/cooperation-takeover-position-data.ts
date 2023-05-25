
export interface CooperationTakeoverPositionData {
  recordId?: number;
  cooperationTakeoverId?: number;
  cooperationTakeoverCode?: string;
  cooperationOrderId?: number;
  cooperationOrderCode?: string;
  workOrderOperationId?: number;
  workOrderOperationCode?: string;
  workOrderOperationPosition?: number;
  nextWorkOrderOperationId?: number;
  nextWorkOrderOperationCode?: string;
  nextWorkOrderOperationPosition?: number;
  nextWorkplaceId?: number;
  nextWorkplaceCode?: string;
  nextWorkplaceName?: string;
  nextResourceId?: number;
  nextResourceCode?: string;
  nextResourceName?: string;
  status?: string;
  position?: number;
  productId?: number;
  productCode?: string;
  productName?: string;
  productUnitOfMeasureCode?: string;
  productUnitOfMeasureName?: string;
  productWeight?: number;
  positionWeight?: number;
  quantity?: number;
  createdDate?: string;
  modifiedDate?: string;
  modifiedBy?: string;
  isDeleted?: boolean;
}