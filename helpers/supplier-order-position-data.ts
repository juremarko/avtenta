import { ProductData } from '../../Truster.Core.UI.CodeTable/helpers/product-data';
import { ValueAddedTaxData } from '../../Truster.Core.UI.CodeTable/helpers/value-added-tax-data';
import { SupplierOrderData } from './supplier-order-data';
import { LocationData } from '../../Truster.Core.UI.CodeTable/helpers/location-data';
import { LotTrackingData } from '../../Truster.Core.UI.CodeTable/helpers/lot-tracking-data';
import { DocumentStatusCodeEnum } from '../../Truster.Core.UI.CodeTable/helpers/document-status-code-enum';

export interface SupplierOrderPositionData {
  recordId?: number;
  supplierOrderId?: number;
  supplierOrder?: SupplierOrderData;
  position?: number;
  productId?: number;
  product?: ProductData;
  productName?: string;
  description?: string;
  quantity?: number;
  quantityOut?: number;
  salesPrice?: number;
  createdDate?: string;
  deliveryDate?: string;
  deliveryDateConfirmed?: string;
  isProtected?: boolean;
  isDeleted?: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
  status?: DocumentStatusCodeEnum;
  lotTrackingId?: number;
  lotTracking?: LotTrackingData;
  locationId?: number;
  location?: LocationData;
  trafficType?: boolean;
  code?: string;
  valueAddedTaxId?: number;
  valueAddedTax?: ValueAddedTaxData;
  discount?: number;
  salesPriceCalculatedValue?: number;
  valueAddedTaxCalculatedValue?: number;
}
