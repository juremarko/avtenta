import { ValueAddedTaxData } from "../../Truster.Core.UI.CodeTable/helpers/value-added-tax-data";
import { WorkOrderOperationData } from "../../Truster.Core.UI.Manufacturing/helpers/work-order-operation-data";
import { CooperationOrderData } from "./cooperation-order-data";

export interface CooperationOrderPositionData {
  recordId?: number;
  cooperationOrderId?: number;
  cooperationOrderCode?: string;
  cooperationSupplierId?: number;
  status?: string;
  position?: number;
  workOrderOperationId?: number;
  workOrderOperationCode?: string;
  workOrderOperationPosition?: number;
  supplierId?: number;
  supplierCode?: string;
  supplierName?: string;
  workplaceId?: number;
  workplaceCode?: string;
  workplaceName?: string;
  resourceId?: number;
  resourceCode?: string;
  resourceName?: string;
  isLastOperation?: boolean;
  productId?: number;
  productCode?: string;
  productName?: string;
  productPriceCalculationType?: string;
  versionCode?: string;
  unitOfMeasureId?: number;
  unitOfMeasureCode?: string;
  unitOfMeasureName?: string;
  productWeight?: number;
  positionWeight?: number;
  salesPrice?: number;
  lastSalesPrice?: number;
  discount?: number;
  discountValue?: number;
  positionValueWithoutDiscount?: number;
  positionValue?: number;
  vatValue?: number;
  positionValueWithVat?: number;
  valueAddedTaxId?: number;
  valueAddedTaxPercentange?: number;
  valueAddedTaxName?: string;
  deliveryDate?: string;
  deliveryDateConfirmed?: string;
  quantityOrder?: number;
  quantityIssued?: number;
  quantityToIssue?: number;
  quantityTakeovered?: number;
  quantityToTakeover?: number;
  createdDate?: string;
  modifiedDate?: string;
  modifiedBy?: string;
  description?: string;
  customerOrderErpOrderNumber?: string;
  customerOrderClientNumber?: string;
  salesPriceCalculatedValue?: number;
  valueAddedTaxCalculatedValue?: number;
  valueAddedTax?: ValueAddedTaxData;
}