import { DocumentTypeData } from "../../Truster.Core.UI.CodeTable/helpers/document-type-data";
import { ProductPriceCalculationTypeEnum } from "../../Truster.Core.UI.CodeTable/helpers/product-price-calculation-type.enum";
import { ProjectData } from "../../Truster.Core.UI.CodeTable/helpers/project-data";
import { TypeOfRealisationData } from "../../Truster.Core.UI.CodeTable/helpers/typeofrealisation-data";
import { ValueAddedTaxReportData } from "../../Truster.Core.UI.CodeTable/helpers/value-added-tax-report-data";

export interface CooperationOrderReportData {
    recordId?: number;
    bookingYear?: number;
    bookingCode?: number;
    documentTypeId?: number;
    documentTypeName?: string;
    documentTypeCode?: string;
    typeOfRealisationId?: number;
    typeOfRealisationName?: string;
    supplierId?: number;
    supplierName?: string;
    createdDate?: string;
    cooperationOrderNumber?: string;
    projectId?: number;
    projectName?: string;
    description?: string;
    isProtected?: boolean;
    modifiedBy?: string;
    modifiedDate?: string;
    isDeleted?: boolean;
    status?: string;
    paymentTypeId?: number;
    paymentTypeName?: string;
    shippingTypeId?: number;
    shippingTypeCode?: string;
    shippingTypeName?: string;
    currencyId?: number;
    currencyCode?: string;
    currencyName?: string;
    bookedDate?: string;
    erpId?: number;
    erpCode?: string;
    erpOrderNo?: string;
    syncDate?: string;
    code?: string;
    discount?: number;
    salesPrice?: number;
    valueAddedTaxId?: number;
    valueAddedTaxName?: string;
    valueAddedTaxPercentage?: number;
    workplaceId?: number;
    workplaceCode?: string;
    workplaceName?: string;
    priceCalculationType?: ProductPriceCalculationTypeEnum;
    documentType?: DocumentTypeData;
    typeOfRealisation?: TypeOfRealisationData;
    project?: ProjectData;
    valueAddedTaxes: ValueAddedTaxReportData[];
    value?: number;
    discountValue?: number;
    vatValue?: number;
    valueWithVat?: number;

    cooperationOrderDisclaimerText?: string;
}