import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { RowNode, GridOptions, GridApi, CellFocusedEvent } from 'ag-grid-community';
import { Subscription, Subject, ReplaySubject, forkJoin, of } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../../../environments/environment';
import { AuthenticationRepository } from '../../../../Truster.Core.UI.Authentication/repositories/authentication.repository';
import { GetCompanyRequest } from '../../../../Truster.Core.UI.CodeTable/commands/requests/get.company.request';
import { GetDocumentTypeScreenRequest } from '../../../../Truster.Core.UI.CodeTable/commands/requests/get.documenttype.screen.request';
import { GetSupplierRequest } from '../../../../Truster.Core.UI.CodeTable/commands/requests/get.supplier.request';
import { CodetableTypeEnum } from '../../../../Truster.Core.UI.CodeTable/helpers/code-table-type-enum';
import { ColumnData } from '../../../../Truster.Core.UI.CodeTable/helpers/column-data';
import { CompanyData } from '../../../../Truster.Core.UI.CodeTable/helpers/company-data';
import { CurrencyData } from '../../../../Truster.Core.UI.CodeTable/helpers/currency-data';
import { CustomerData } from '../../../../Truster.Core.UI.CodeTable/helpers/customer-data';
import { DocumentStatusCodeEnum } from '../../../../Truster.Core.UI.CodeTable/helpers/document-status-code-enum';
import { DocumentTypeData } from '../../../../Truster.Core.UI.CodeTable/helpers/document-type-data';
import { LocalStorageConfig } from '../../../../Truster.Core.UI.CodeTable/helpers/localStorageConfig';
import { PaymentTypeData } from '../../../../Truster.Core.UI.CodeTable/helpers/payment-type-data';
import { ProductData } from '../../../../Truster.Core.UI.CodeTable/helpers/product-data';
import { ProductPriceCalculationTypeData } from '../../../../Truster.Core.UI.CodeTable/helpers/product-price-calculation-type-data';
import { ProductPriceCalculationTypeDataInterface } from '../../../../Truster.Core.UI.CodeTable/helpers/product-price-calculation-type-data-interface';
import { ProductPriceCalculationTypeStringsEnum } from '../../../../Truster.Core.UI.CodeTable/helpers/product-price-calculation-type-strings.enum';
import { ProjectData } from '../../../../Truster.Core.UI.CodeTable/helpers/project-data';
import { ShippingTypeData } from '../../../../Truster.Core.UI.CodeTable/helpers/shipping-type-data';
import { SupplierData } from '../../../../Truster.Core.UI.CodeTable/helpers/supplier-data';
import { TypeOfRealisationData } from '../../../../Truster.Core.UI.CodeTable/helpers/typeofrealisation-data';
import { ValueAddedTaxData } from '../../../../Truster.Core.UI.CodeTable/helpers/value-added-tax-data';
import { WorkplaceData } from '../../../../Truster.Core.UI.CodeTable/helpers/workplace-data';
import { CodeTableService } from '../../../../Truster.Core.UI.CodeTable/services/code-table.service';
import { CurrencyComponent } from '../../../../Truster.Core.UI.CodeTable/views/currency/currency.component';
import { PaymentTypeComponent } from '../../../../Truster.Core.UI.CodeTable/views/payment-type/payment-type.component';
import { ProjectComponent } from '../../../../Truster.Core.UI.CodeTable/views/project/project.component';
import { ShippingTypeComponent } from '../../../../Truster.Core.UI.CodeTable/views/shipping-type/shipping-type.component';
import { SupplierComponent } from '../../../../Truster.Core.UI.CodeTable/views/supplier/supplier.component';
import { TypeOfRealisationComponent } from '../../../../Truster.Core.UI.CodeTable/views/type-of-realisation/type-of-realisation.component';
import { ValueAddedTaxComponent } from '../../../../Truster.Core.UI.CodeTable/views/value-added-tax/value-added-tax.component';
import { WorkplaceComponent } from '../../../../Truster.Core.UI.CodeTable/views/workplace/workplace.component';
import { ProductPriceCalculationTypeDialogComponent } from '../../../../Truster.Core.UI.CodeTable/views/_staticDialogs/product-price-calculation-type-dialog/product-price-calculation-type-dialog.component';
import { ManufacturingService } from '../../../../Truster.Core.UI.Manufacturing/services/manufacturing.service';
import { CooperationWorkOrderOperationsDialogComponent } from '../cooperation-work-order-operations-dialog/cooperation-work-order-operations-dialog.component';
import { ScreensFactory } from '../../../../Truster.Core.UI.Permission/factories/screens.factory';
import { AccessTypeEnum } from '../../../../Truster.Core.UI.Permission/helpers/access.type.enum';
import { ScreenTypeFactoryEnum } from '../../../../Truster.Core.UI.Permission/helpers/screen.type.factory.enum';
import { PermissionRepository } from '../../../../Truster.Core.UI.Permission/repositories/permission.repository';
import { AgGridBaseComponent } from '../../../../Truster.Core.UI.SharedUIComponents/ag-grid/ag-grid-base/ag-grid-base.component';
import { AgGridDateEditorComponent } from '../../../../Truster.Core.UI.SharedUIComponents/ag-grid/editors/ag-grid-date-editor/ag-grid-date-editor.component';
import { AgGridDialogEditorComponent } from '../../../../Truster.Core.UI.SharedUIComponents/ag-grid/editors/ag-grid-dialog-editor/ag-grid-dialog-editor.component';
import { AgGridInputCellEditorComponent } from '../../../../Truster.Core.UI.SharedUIComponents/ag-grid/editors/ag-grid-input-cell-editor/ag-grid-input-cell-editor.component';
import { JsReportManufacturingRequest } from '../../../../Truster.Core.UI.SharedUIComponents/commands/jsreportmanufacturing.request';
import { ConfirmationDialogComponent } from '../../../../Truster.Core.UI.SharedUIComponents/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DocumentTypeEnum } from '../../../../Truster.Core.UI.SharedUIComponents/helpers/document-type-enum';
import { DocumentEventArgs } from '../../../../Truster.Core.UI.SharedUIComponents/helpers/document.event.args';
import { JsReportBaseData } from '../../../../Truster.Core.UI.SharedUIComponents/helpers/jsreport-base-data';
import { JsReportTemplateData } from '../../../../Truster.Core.UI.SharedUIComponents/helpers/jsreport-template-data';
import { ResultCodeEnum } from '../../../../Truster.Core.UI.SharedUIComponents/helpers/result.code.enum';
import { PermissionTypeService } from '../../../../Truster.Core.UI.SharedUIComponents/interfaces/permission.type.service';
import { ScreenTypeService } from '../../../../Truster.Core.UI.SharedUIComponents/interfaces/screen.type.service';
import { TrusterViewItem } from '../../../../Truster.Core.UI.SharedUIComponents/interfaces/truster.view.item.interface';
import { DatePipeProxy } from '../../../../Truster.Core.UI.SharedUIComponents/pipes/date.pipe.proxy';
import { AgGridService } from '../../../../Truster.Core.UI.SharedUIComponents/services/ag-grid.service';
import { JsReportService } from '../../../../Truster.Core.UI.SharedUIComponents/services/js-report.service';
import { SnackbarService } from '../../../../Truster.Core.UI.SharedUIComponents/services/snackbar.service';
import { TranslationFactory } from '../../../../Truster.Core.UI.Translation/factories/translation.factory';
import { DeleteCooperationOrderPositionRequest } from '../../../commands/requests/delete.cooperation.order.position.request';
import { DeleteCooperationOrderRequest } from '../../../commands/requests/delete.cooperation.order.request';
import { GetCooperationOrderPositionRequest } from '../../../commands/requests/get.cooperation.order.position.request';
import { GetCooperationOrderRequest } from '../../../commands/requests/get.cooperation.order.request';
import { GetCooperationOrderSummaryRequest } from '../../../commands/requests/get.cooperation.order.summary.request';
import { PostCooperationOrderCancelRequest } from '../../../commands/requests/post.cooperation.order.cancel.request';
import { PostCooperationOrderConfirmRequest } from '../../../commands/requests/post.cooperation.order.confirm.request';
import { PostCooperationOrderCopyRequest } from '../../../commands/requests/post.cooperation.order.copy.request';
import { PostCooperationOrderOpenRequest } from '../../../commands/requests/post.cooperation.order.open.request';
import { PostCooperationOrderPositionsRequest } from '../../../commands/requests/post.cooperation.order.positions.request';
import { PostCooperationOrderRequest } from '../../../commands/requests/post.cooperation.order.request';
import { PutCooperationOrderPositionRequest } from '../../../commands/requests/put.cooperation.order.position.request';
import { PutCooperationOrderRequest } from '../../../commands/requests/put.cooperation.order.request';
import { PostCooperationOrderResponse } from '../../../commands/responses/post.cooperation.order.response';
import { CooperationOrderData } from '../../../helpers/cooperation-order-data';
import { CooperationOrderPositionData } from '../../../helpers/cooperation-order-position-data';
import { CooperationOrderSummaryData } from '../../../helpers/cooperation-order-summary-data';
import { SupplierOrderPositionData } from '../../../helpers/supplier-order-position-data';
import { ProcurementService } from '../../../services/procurement.service';
import { PostCooperationOrderRecalculatePriceRequest } from '../../../commands/requests/post.cooperation.order.recalculate.price.request';
import { PostCooperationOrderRecalculatePriceResponse } from '../../../commands/responses/post.cooperation.order.recalculate.price.response';
import { CooperationOrderStatusEnum } from '../../../helpers/cooperation-order-status-enum';
import { CooperationOrderStatusEnumStrings } from '../../../helpers/cooperation-order-status-enum-strings';
import { GetEmployeeOnlineUserRequest } from '../../../../Truster.Core.UI.CodeTable/commands/requests/get.employee.onlineuser.request';
import { EmployeeData } from '../../../../Truster.Core.UI.CodeTable/helpers/employee-data';
import { IBusyConfig } from 'ng-busy';
import { BusyConfigFactory } from '../../../../Truster.Core.UI.SharedUIComponents/loading-spinner/busy.config.factory';
import { CooperationOrderActivePositionsDialogComponent } from '../cooperation-order/cooperation-order-active-positions-dialog/cooperation-order-active-positions-dialog.component';
import { PostCooperationOrderCloseRequest } from '../../../commands/requests/post.cooperation.order.close.request';
import { Router, ActivatedRoute } from '@angular/router';
import { GetCooperationOrderReportRequest } from '../../../commands/requests/get.cooperation.order.report.request';
import { CooperationOrderPositionPricesDialogComponent } from './cooperation-order-position-prices-dialog/cooperation-order-position-prices-dialog.component';
import { VATCalculationTypeData } from '../../../../Truster.Core.UI.Sales/helpers/vat-calculation-type-data';
import { GetVATCalculationTypesRequest } from '../../../../Truster.Core.UI.Sales/commands/requests/get.vatcalculation.types.request';
import { SalesService } from '../../../../Truster.Core.UI.Sales/services/sales.service';
import { GetCooperationOrderCalculationsRequest } from '../../../../Truster.Core.UI.Sales/commands/requests/get.cooperationorder.calculations.request';
import { VATCalculationElementTypeStringsEnum } from '../../../../Truster.Core.UI.Sales/helpers/vat-calculation-element-type-strings-enum';
import { VATCalculationsData } from '../../../../Truster.Core.UI.Sales/helpers/vat-calculations-data';
import { VATCalculationTypeStringsEnum } from '../../../../Truster.Core.UI.Sales/helpers/vat-calculation-type-strings-enum';
import { GetDocumentTypeCalculationTypeClausesRequest } from '../../../../Truster.Core.UI.CodeTable/commands/requests/get.clause.request';

@Component({
    selector: 'cooperation-order',
    templateUrl: 'cooperation-order.component.html',
    styleUrls: ['cooperation-order.component.scss']
})
export class CooperationOrderComponent extends AgGridBaseComponent implements OnInit, OnDestroy {
    //Ag grid ViewChilds
    @ViewChild('cooperationOrderGrid', { static: true }) cooperationOrderGrid: AgGridAngular;

    private cooperationOrderPositionGrid: AgGridAngular;
    @ViewChild('cooperationOrderPositionGrid', { static: false }) set coopOrderPosGrid(component: AgGridAngular) {
        if (component) {
            this.cooperationOrderPositionGrid = component;
        }
    };


    @ViewChild('searchInput', { static: true }) searchInput: ElementRef;


    //Ag grid related properties
    chosenCooperationOrderNode: RowNode;
    chosenCooperationOrderPositionNode: RowNode;

    cooperationOrdersGridOptions: GridOptions = {
        localeText: this._localeText,
        animateRows: false,
        defaultColDef: {
            width: 200,
            editable: true,
            resizable: true
        },
        rowSelection: "single",
        editType: "fullRow",
        accentedSort: true,
        suppressColumnVirtualisation: true,
        suppressClipboardPaste: true,
        suppressCopyRowsToClipboard: true,

        tabToNextCell: this.tabToNextCell.bind(this),
        onSortChanged: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationOrdersScreen, event);
        },
        onSelectionChanged: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationOrdersScreen, event);
        },
        onFilterChanged: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationOrdersScreen, event);
        },
        onColumnResized: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationOrdersScreen, event);
        },
        onColumnMoved: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationOrdersScreen, event);
        },
        onColumnPinned: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationOrdersScreen, event);
        },
        onColumnVisible: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationOrdersScreen, event);
        },
        onRowEditingStarted: (event) => {
            var rowNode: RowNode = event.node;
            this.focusLastEditableCell(this.cooperationOrderGrid, rowNode);
        },
        onGridReady: (event) => {
            this.onAddViewCompontentAgGrid(this.cooperationOrderGrid);
        },
        onCellFocused: (event: CellFocusedEvent) => this.setLastEditableCell(event),
        rowClassRules: {
            'truster-row-selected': (params) => {
                if (params.data && params.data.inEditMode) {
                    return params.data.inEditMode;
                }
            }
        },
        sideBar: {
            toolPanels: [
                {
                    id: "columns",
                    labelDefault: this.translateService.instant("FORMS.FIELDS.columns"),
                    labelKey: "columns",
                    iconKey: "columns",
                    toolPanel: "agColumnsToolPanel",
                    toolPanelParams: {
                        suppressRowGroups: true,
                        suppressValues: true,
                        suppressPivots: true,
                        suppressPivotMode: true,
                        suppressSideButtons: true,
                        suppressColumnFilter: true,
                        suppressColumnSelectAll: true,
                        suppressColumnExpandAll: true
                    }
                },
                {
                    id: "filters",
                    labelDefault: this.translateService.instant("FORMS.FIELDS.filters"),
                    labelKey: "filters",
                    iconKey: "filter",
                    toolPanel: "agFiltersToolPanel",
                    toolPanelParams: {
                        suppressExpandAll: true,
                        suppressFilterSearch: true
                    }
                }
            ]
        },
        statusBar: {
            statusPanels: [
                { statusPanel: 'agTotalRowCountComponent', align: 'left' },
                { statusPanel: "agFilteredRowCountComponent" },
                { statusPanel: "agSelectedRowCountComponent" },
                { statusPanel: "agAggregationComponent" }
            ]
        },
        context: this
    };

    cooperationOrderPositionsGridOptions: GridOptions = {
        localeText: this._localeText,
        animateRows: false,
        defaultColDef: {
            width: 200,
            editable: true,
            resizable: true
        },
        rowSelection: "single",
        editType: "fullRow",
        accentedSort: true,
        suppressColumnVirtualisation: true,
        suppressClipboardPaste: true,
        suppressCopyRowsToClipboard: true,
        tabToNextCell: this.tabToNextCell.bind(this),
        onCellFocused: (event: CellFocusedEvent) => this.setLastEditableCell(event),
        onRowEditingStarted: (event) => {
            var rowNode: RowNode = event.node;
            this.focusLastEditableCell(this.cooperationOrderPositionGrid, rowNode);
        },
        onGridReady: (event) => {
            this.onAddViewCompontentAgGrid(this.cooperationOrderPositionGrid);
        },
        rowClassRules: {
            'truster-row-selected': (params) => {
                if (params.data && params.data.inEditMode) {
                    return params.data.inEditMode;
                }
            }
        },
        sideBar: {
            toolPanels: [
                {
                    id: "columns",
                    labelDefault: this.translateService.instant("FORMS.FIELDS.columns"),
                    labelKey: "columns",
                    iconKey: "columns",
                    toolPanel: "agColumnsToolPanel",
                    toolPanelParams: {
                        suppressRowGroups: true,
                        suppressValues: true,
                        suppressPivots: true,
                        suppressPivotMode: true,
                        suppressSideButtons: true,
                        suppressColumnFilter: true,
                        suppressColumnSelectAll: true,
                        suppressColumnExpandAll: true
                    }
                },
                {
                    id: "filters",
                    labelDefault: this.translateService.instant("FORMS.FIELDS.filters"),
                    labelKey: "filters",
                    iconKey: "filter",
                    toolPanel: "agFiltersToolPanel",
                    toolPanelParams: {
                        suppressExpandAll: true,
                        suppressFilterSearch: true
                    }
                }
            ]
        },
        statusBar: {
            statusPanels: [
                { statusPanel: 'agTotalRowCountComponent', align: 'left' },
                { statusPanel: "agFilteredRowCountComponent" },
                { statusPanel: "agSelectedRowCountComponent" },
                { statusPanel: "agAggregationComponent" }
            ]
        },
        context: this
    };

    //Subscriptions
    documentBusy: IBusyConfig = BusyConfigFactory.create();
    cooperationOrderPositionGridBusy: IBusyConfig = BusyConfigFactory.create();

    dropdownChangeSubscriber: Subscription;
    addPositionDataSubscriber: Subscription;
    addPositionVisibilitySubscriber: Subscription;

    //Observable subjects properties
    private addPositionDataChange = new Subject<any>();
    private addPositionVisibilityChange = new Subject<boolean>();
    addPositionObservable = this.addPositionDataChange.asObservable();
    addPositionVisibilityObservable = this.addPositionVisibilityChange.asObservable();
    filteredDocumentTypes: ReplaySubject<any> = new ReplaySubject<any>();
    filteredCostCenters: ReplaySubject<any> = new ReplaySubject<any>();
    filteredPaymentTypes: ReplaySubject<any> = new ReplaySubject<any>();
    filteredTransportTypes: ReplaySubject<any> = new ReplaySubject<any>();

    //Form related properties
    cooperationOrderDetailsForm: FormGroup;
    cooperationOrdersDateRangeFormGroup: FormGroup;

    //Object data related properties
    cooperationOrdersData: CooperationOrderData[] = [];
    cooperationOrderPositionData: CooperationOrderPositionData[] = [];
    selectedSupplierOrderPositions: SupplierOrderPositionData = {};
    selectedCooperationOrderData: CooperationOrderData = {};
    chosenCoopeartionOrderSummaryData: CooperationOrderSummaryData = {};
    documentTypeData: DocumentTypeData[] = [];
    typeOfRealisationData: TypeOfRealisationData[] = [];
    supplierData: SupplierData[] = [];
    projectData: ProjectData[] = [];
    paymentTypeData: PaymentTypeData[] = [];
    currencyData: CurrencyData[] = [];
    shippingTypeData: ShippingTypeData[] = [];
    productData: ProductData[] = [];
    positionProductData: ProductData[] = [];
    valueAddedTaxData: ValueAddedTaxData[] = [];
    vatCalculationTypesList: VATCalculationTypeData[] = [];
    companyData: CompanyData[] = [];
    documentTypes = [];
    costCenters = [];
    paymentTypes = [];
    currencies = [];
    transportTypes = [];
    extraColumnsData: ColumnData[] = [];
    cooperationOrderCalculations: VATCalculationsData = {};

    // Local storage variables
    config: LocalStorageConfig = null;
    areaSplitWindowWidths: number[];
    areaSplitWindowNumber: number;

    restrictMove: boolean = false;
    showAddPosition: boolean = false;
    showVAT = false;

    locale;
    statusData = this.enumToArray(CooperationOrderStatusEnum);
    selectedStatus: CooperationOrderStatusEnum = CooperationOrderStatusEnum.active;
    CooperationOrderStatusEnumStrings = CooperationOrderStatusEnumStrings;
    addNewCooperationOrderDisabled = true;

    //Document actions
    saveOrUpdateDisabled = true;
    authorizeDisabled = true;
    openDisabled = true;
    copyDisabled = true;
    deleteDisabled = true;
    closeDisabled = true;
    reportsDisabled = true;
    cancelDisabled = true;
    isCooperationForAllPositionsComplete: boolean = true;

    //Document flags
    allowedToManipulateUIElements = false;
    allowedToChangeDocumentType = false;

    DocumentStatusCodeEnum = DocumentStatusCodeEnum;

    constructor(private snackbarService: SnackbarService,
        public agGridService: AgGridService,
        public authRepository: AuthenticationRepository,
        private translationFactory: TranslationFactory,
        private formBuilder: FormBuilder,
        private datePipe: DatePipeProxy,
        private decimalPipe: DecimalPipe,
        public permissionRepository: PermissionRepository,
        private dialog: MatDialog,
        private procurementService: ProcurementService,
        private codeTableService: CodeTableService,
        private manufacturingService: ManufacturingService,
        private salesService: SalesService,
        public screenTypeService: ScreenTypeService,
        public permissionTypeService: PermissionTypeService,
        public translateService: TranslateService,
        private staticProductPriceCalculationTypeData: ProductPriceCalculationTypeData,
        private jsReportService: JsReportService,
        public screensFactory: ScreensFactory,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public renderer: Renderer2) {
        super(agGridService, translateService, authRepository, permissionRepository, screenTypeService, permissionTypeService, screensFactory, renderer);

        this.locale = this.translationFactory.getPreferredLanguage().name;
    }

    //! Angular Functions START


    ngOnDestroy(): void {
        //VERY IMPORTANT: All subscribers need to be manually unsubsribed here!!!

        if (this.documentBusy) {
            this.documentBusy.busy.forEach((busyElement: Subscription) => {
                busyElement.unsubscribe();
            })
        }

        if (this.cooperationOrderPositionGridBusy) {
            this.cooperationOrderPositionGridBusy.busy.forEach((busyElement: Subscription) => {
                busyElement.unsubscribe();
            })
        }

        if (this.dropdownChangeSubscriber) {
            this.dropdownChangeSubscriber.unsubscribe();
        }

        if (this.addPositionDataSubscriber) {
            this.addPositionDataSubscriber.unsubscribe();
        }
        if (this.addPositionVisibilitySubscriber) {
            this.addPositionVisibilitySubscriber.unsubscribe();
        }
        if (this.routeSubscriber) {
            this.routeSubscriber.unsubscribe();
        }
    }

    ngOnInit(): void {
        //1. Check UI permissions
        this.checkUIPermissions("purchaseCooperationOrder", "purchaseCooperationOrderManagement");
        this.setDocumentActionPermissions();

        //2. Set local storage stuff - function sets split area widths from local storage.
        this.setSplitAreas(ScreenTypeFactoryEnum.cooperationOrdersScreen);

        //3. Initialize Forms
        this.initializeClassForms();
        this.getVATCalculationTypes();

        //4. Subscribe to route params change and load data
        this.routeSubscriber = this.activatedRoute.params.subscribe(params => {

            if (Object.keys(params).length > 0) {
                var cooperationOrderId = params["ofRowId"];
                if (cooperationOrderId == 'undefined') {
                    cooperationOrderId = undefined;
                }
                this.selectedStatus = Number(params["ofStatus"]);

                var dateFrom = params["ofDateFrom"];
                var dateTo = params["ofDateTo"];

                //Loading specific document
                if (cooperationOrderId) {
                    //user is creating new customer order
                    if (cooperationOrderId == 0) {
                        setTimeout(() => {
                            this.headTabVisible = true;
                            this.positionsTabVisible = false;
                            this.currentTabIndex = 2; //select header tab
                            return;
                        }, 20)
                    }
                    else {
                        setTimeout(() => {
                            this.headTabVisible = true;
                            this.positionsTabVisible = true;
                            this.currentTabIndex = 2; //select positions tab
                        }, 20)
                    }
                }
                else {
                    this.headTabVisible = false;
                    this.positionsTabVisible = false;

                    //Important
                    //We need to manualy clear the ag-grid reference, 
                    //because on back browser button angular is not destroying it from memory 
                    this.cooperationOrderPositionGrid = undefined;

                    //Reinitialize variables
                    this.selectedCooperationOrderData = {};
                }

                //Loads overview tab with query params
                this.getScreenData(cooperationOrderId, this.selectedStatus, dateFrom, dateTo);
            }
        })

        //5. Navigate to load data
        this.router.navigate(['procurement/cooperation/orders',
            {
                ofStatus: this.selectedStatus,
                ofDateFrom: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("start").value.toISOString()),
                ofDateTo: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("end").value.toISOString())
            }]);
    }

    //Focus on search field after view init
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        }, 300);
    }

    //! Angular Functions END

    //Triggers when date range changes in date range picker
    onDateFilterChanged(event) {
        //then we selected end range, we need to call api to fitler the results with new dates
        if (event.value != null) {
            this.router.navigate(['procurement/cooperation/orders',
                {
                    ofRowId: this.selectedCooperationOrderData.recordId,
                    ofStatus: this.selectedStatus,
                    ofDateFrom: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("start").value.toISOString()),
                    ofDateTo: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("end").value.toISOString())
                }]);
        }
    }


    onStatusChanged(params) {

        this.addNewCooperationOrderDisabled = true;
        if (this.selectedStatus == CooperationOrderStatusEnum.preparation) {
            this.addNewCooperationOrderDisabled = false;
        }

        this.router.navigate(['procurement/cooperation/orders',
            {
                ofStatus: this.selectedStatus,
                ofDateFrom: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("start").value.toISOString()),
                ofDateTo: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("end").value.toISOString())
            }]);
    }

    //Single click row on cooperation orders - we enable buttons only
    onCooperationOrderDetailsRowClicked(params) {
        this.setDocumentActionPermissions();
    }

    //Opens cooperation order details (DocumentHead) (double click row)
    onCooperationOrderDetails(params) {
        var rowNode: RowNode = params.node;
        this.handleEmptyGridColumns(1, rowNode);
        if (params.data.recordId == 0 && this.selectedCooperationOrderData.recordId == 0) {
            return;
        }

        //assign the new object value
        this.selectedCooperationOrderData = Object.assign({}, params.data);
        if (this.selectedCooperationOrderData && this.selectedCooperationOrderData.vatCalculationTypeId) {
            var vatCalculationTypeElement = this.vatCalculationTypesList.filter(el => el.recordId === this.selectedCooperationOrderData.vatCalculationTypeId)[0];
            this.selectedCooperationOrderData.vatCalculationType = vatCalculationTypeElement;
        }

        //reset document action permissions
        this.setDocumentActionPermissions();

        //set form data
        this.setCooperationOrderDetailsFormData();

        //manipulate head and position documents
        this.chosenCooperationOrderNode = params.node;

        // Then navigates to desired url 
        this.router.navigate(['procurement/cooperation/orders',
            {
                ofRowId: this.selectedCooperationOrderData.recordId,
                ofStatus: this.selectedStatus,
                ofDateFrom: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("start").value.toISOString()),
                ofDateTo: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("end").value.toISOString())
            }]);

    }

    //Adds a new item to the grid and opens cooperation order details (DocumentHead)
    addNewCooperationOrder() {
        if (this.selectedCooperationOrderData.recordId == 0) {
            return;
        }

        var defaultDocumentType = this.documentTypeData.find(x => x.code == DocumentTypeEnum.CooperationOrderDocumentType);

        var newItem = {
            recordId: 0,
            code: this.translateService.instant("DATA.newItem"),
            documentTypeId: defaultDocumentType.recordId,
            documentType: defaultDocumentType,
            description: "",
            discount: "",
            isActive: true,
            status: DocumentStatusCodeEnum.preparation
        };

        newItem['bookedDate'] = new Date();

        setTimeout(() => {

            var data = newItem;
            this.onCooperationOrderDetails({ data: data, node: null });
        }, 1);

    }

    allowedToChangeDocumentTypeUI() {
        var retVal = false;

        //we only allow changing document type if document is not saved yet, in creation mode
        if (this.selectedCooperationOrderData && this.selectedCooperationOrderData.recordId === 0) {
            retVal = true;
        }

        return retVal;
    }

    //Trigers the position data change event and update
    onAddPositionDataChange(eventArgs: DocumentEventArgs) {
        this.addPositionDataChange.next(eventArgs);
    }

    //Trigers the position visibility change event and update
    onAddPositionVisibilityChange(isVisible: boolean) {
        this.addPositionVisibilityChange.next(isVisible);
    }

    //Controls DocumentHead data
    onChangeDocumentHeadVisibility(isVisible) {
        this.onDocumentHeadVisibilityChange(isVisible);

        //1. We only send data to header screen, if only one item is selected in grid
        if (isVisible) {
            var selectedRowNodes = this.cooperationOrderGrid.api.getSelectedNodes();

            if (selectedRowNodes.length === 1) {
                //2. Manipulate views
                var data = selectedRowNodes[0].data;
                var status = data.status;

                this.selectedCooperationOrderData = selectedRowNodes[0].data;
                this.chosenCooperationOrderNode = selectedRowNodes[0];

                this.setDocumentActionPermissions();


                var document: TrusterViewItem = {
                    title: this.translateService.instant("SCREEN.PROCUREMENT.SUPPLIERORDERS.order_number") + ": " + data.code,
                    status: status
                };

                var eventArgs: DocumentEventArgs = {
                    data: data,
                    viewItem: document
                };

                var documentPositions: TrusterViewItem = {
                    title: this.translateService.instant("SCREEN.PROCUREMENT.SUPPLIERORDERS.order_positions") + ": " + data.code
                };

                var eventArgsPositions: DocumentEventArgs = {
                    data: data,
                    viewItem: documentPositions
                };

                this.onDocumentHeadDataChange(eventArgs);
                this.onDocumentPositionsDataChange(eventArgsPositions);

                //3. Reset data
                this.setCooperationOrderDetailsFormData();
                this.getPositions(data.recordId);
            }
        }
    }

    //Controls DocumentPositions data
    onChangeDocumentPositionsVisibility(isVisible) {
        this.onDocumentPositionsVisibilityChange(isVisible);


        //1. We only send data to positions screen, if only one item is selected in grid
        if (isVisible) {
            var selectedRowNodes = this.cooperationOrderGrid.api.getSelectedNodes();

            if (selectedRowNodes.length === 1) {
                //2. Manipulate views
                var data = selectedRowNodes[0].data;
                this.selectedCooperationOrderData = data;
                this.chosenCooperationOrderNode = selectedRowNodes[0];
                this.getPositions(data.recordId);

                var status = data.status;

                var document: TrusterViewItem = {
                    title: this.translateService.instant("SCREEN.PROCUREMENT.SUPPLIERORDERS.order_number") + ": " + data.code,
                    status: status
                };

                var eventArgs: DocumentEventArgs = {
                    data: data,
                    viewItem: document
                };
                var documentPositions: TrusterViewItem = {
                    title: this.translateService.instant("SCREEN.PROCUREMENT.SUPPLIERORDERS.order_positions") + ": " + data.code
                };

                var eventArgsPositions: DocumentEventArgs = {
                    data: data,
                    viewItem: documentPositions
                };

                this.onDocumentHeadDataChange(eventArgs);
                this.onDocumentPositionsDataChange(eventArgsPositions);

                //3. Reset data
                this.setCooperationOrderDetailsFormData();

                //4. Set document permissions
                this.setDocumentActionPermissions();
            }
        }
    }

    //Update row node with new data (checked / unchecked)
    onCheckboxParamsChanged(event) {
        var rowNode: RowNode = event.node;
        var data = event.data;
        data[event.colDef.field] = event.value;

        setTimeout(() => {
            rowNode.updateData(data); //Update our rownode
        }, 1);
    }

    //Performs search of supplier orders in ag-grid
    onSearchCooperationOrders(params) {
        this.cooperationOrderGrid.api.setQuickFilter(params.target.value);
    }

    //Performs search of positions in ag-grid
    onPositionSearch(params) {
        this.cooperationOrderPositionGrid.api.setQuickFilter(params.target.value);
    }

    onShowActiveCooperationPositions() {
        this.onShowActiveCooperationPositionsDialog();
    }

    onShowCooperationOrderPositions() {
        this.onShowCooperationOrderPositionsDialog();
    }

    //! DOCUMENT HEAD ACTIONS

    //Action saves or updates supplier order in DocumentHead
    onSaveOrUpdateCooperationOrder(event) {
        //Confirmation dialog
        let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            height: 'auto',
            width: '40%'
        });

        this.translateService.get(['SCREEN.PROCUREMENT.COOPERATIONORDERS.save_action_title', 'DATA.yes', 'DATA.no', 'SCREEN.PROCUREMENT.COOPERATIONORDERS.save_action_text']).subscribe((tResult: string) => {
            dialogRef.componentInstance.actionCancel = tResult["DATA.no"];
            dialogRef.componentInstance.actionYes = tResult["DATA.yes"];
            dialogRef.componentInstance.dialogText = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.save_action_text"];
            dialogRef.componentInstance.dialogTitle = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.save_action_title"];
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result && result === 'ok') {
                if (!this.objectHasEmptyNullValues(this.selectedCooperationOrderData)) {
                    if (this.selectedCooperationOrderData) {

                        //var documentType: CustomerData = this.cooperationOrderDetailsForm.controls.documentType.value;
                        var typeOfRealisation: TypeOfRealisationData = this.cooperationOrderDetailsForm.controls.typeOfRealisation.value;
                        var project: ProjectData = this.cooperationOrderDetailsForm.controls.project.value;
                        var workplace: WorkplaceData = this.cooperationOrderDetailsForm.controls.workplace.value;
                        var supplier: CustomerData = this.cooperationOrderDetailsForm.controls.supplier.value;
                        var shippingType: ShippingTypeData = this.cooperationOrderDetailsForm.controls.shippingType.value;
                        var currency: CurrencyData = this.cooperationOrderDetailsForm.controls.currency.value;
                        var valueAddedTax: ValueAddedTaxData = this.cooperationOrderDetailsForm.controls.valueAddedTax.value;
                        var paymentType: PaymentTypeData = this.cooperationOrderDetailsForm.controls.paymentType.value;
                        var priceCalculationType: ProductPriceCalculationTypeDataInterface = this.cooperationOrderDetailsForm.controls.priceCalculationType.value;
                        var typeOfRealisation: TypeOfRealisationData = this.cooperationOrderDetailsForm.controls.typeOfRealisation.value;
                        var vatCalculationType: VATCalculationTypeData = this.cooperationOrderDetailsForm.controls.vatCalculationType.value;

                        if (this.selectedCooperationOrderData.recordId != 0) {
                            //updating supplier order
                            var putData = new PutCooperationOrderRequest();
                            putData.cooperationOrderId = this.selectedCooperationOrderData.recordId;

                            putData.supplierId = this.selectedCooperationOrderData.supplierId;
                            if (supplier) {
                                putData.supplierId = supplier.recordId;
                            }
                            putData.projectId = this.selectedCooperationOrderData.projectId;
                            if (project) {
                                putData.projectId = project.recordId;
                            }
                            putData.typeOfRealisationId = this.selectedCooperationOrderData.typeOfRealisationId;
                            if (typeOfRealisation) {
                                putData.typeOfRealisationId = typeOfRealisation.recordId;
                            }
                            putData.shippingTypeId = this.selectedCooperationOrderData.shippingTypeId;
                            if (shippingType) {
                                putData.shippingTypeId = shippingType.recordId;
                            }
                            putData.paymentTypeId = this.selectedCooperationOrderData.paymentTypeId;
                            if (paymentType) {
                                putData.paymentTypeId = paymentType.recordId;
                            }
                            putData.currencyId = this.selectedCooperationOrderData.currencyId;
                            if (currency) {
                                putData.currencyId = currency.recordId;
                            }
                            putData.workplaceId = this.selectedCooperationOrderData.workplaceId;
                            if (workplace) {
                                putData.workplaceId = workplace.recordId;
                            }
                            putData.valueAddedTaxId = this.selectedCooperationOrderData.valueAddedTaxId;
                            if (valueAddedTax) {
                                putData.valueAddedTaxId = valueAddedTax.recordId;
                            }
                            if (priceCalculationType) {
                                putData.priceCalculationType = priceCalculationType.value;
                            }
                            putData.vatCalculationTypeId = this.selectedCooperationOrderData.vatCalculationTypeId;
                            if (vatCalculationType) {
                                putData.vatCalculationTypeId = vatCalculationType.recordId;
                            }

                            putData.cooperationOrderNumber = this.cooperationOrderDetailsForm.controls.cooperationOrderNumber.value;
                            putData.description = this.cooperationOrderDetailsForm.controls.description.value;
                            putData.bookedDate = this.cooperationOrderDetailsForm.controls.bookedDate.value;
                            putData.discountString = this.cooperationOrderDetailsForm.controls.discount.value;
                            putData.salesPriceString = this.cooperationOrderDetailsForm.controls.salesPrice.value;

                            this.documentBusy.busy.push(this.procurementService.updateCooperationOrder(putData).subscribe(
                                (success) => {

                                    //Mark edited row on the grid
                                    this.selectedCooperationOrderData = success;
                                    this.selectedCooperationOrderData["inEditMode"] = true;

                                    this.chosenCooperationOrderNode.setData(this.selectedCooperationOrderData);

                                    //Refresh document head data
                                    this.setDocumentActionPermissions();
                                    this.refreshSummaryTable();

                                    //Correct input fields
                                    this.cooperationOrderDetailsForm.controls["salesPrice"].setValue(this.numberFormatter(success.salesPrice, this.locale));
                                    this.cooperationOrderDetailsForm.controls["salesPrice"].updateValueAndValidity();
                                    this.cooperationOrderDetailsForm.controls["discount"].setValue(this.numberFormatter(success.discount, this.locale));
                                    this.cooperationOrderDetailsForm.controls["discount"].updateValueAndValidity();

                                    this.router.navigate(['procurement/cooperation/orders',
                                        {
                                            ofRowId: this.selectedCooperationOrderData.recordId,
                                            ofStatus: this.selectedStatus,
                                            ofDateFrom: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("start").value.toISOString()),
                                            ofDateTo: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("end").value.toISOString())
                                        }]);

                                    this.getPositions(this.selectedCooperationOrderData.recordId);
                                },
                                (exception) => {
                                    var errorCode: ResultCodeEnum = exception.error.resultCode;
                                    var resultCode = "RESULT_CODES." + ResultCodeEnum[errorCode];

                                    this.translateService.get(["RESULT_CODES.error_title", resultCode]).subscribe(
                                        (tResult: string) => {
                                            Swal.fire(tResult["RESULT_CODES.error_title"], tResult[resultCode], 'error');
                                        }
                                    )
                                }
                            ))
                        }
                        else {
                            //creating supplier order
                            var postCooperationOrderRequest = new PostCooperationOrderRequest();
                            postCooperationOrderRequest.documentTypeId = this.selectedCooperationOrderData.documentTypeId;

                            postCooperationOrderRequest.supplierId = this.selectedCooperationOrderData.supplierId;
                            if (supplier) {
                                postCooperationOrderRequest.supplierId = supplier.recordId;
                            }
                            postCooperationOrderRequest.projectId = this.selectedCooperationOrderData.projectId;
                            if (project) {
                                postCooperationOrderRequest.projectId = project.recordId;
                            }
                            postCooperationOrderRequest.typeOfRealisationId = this.selectedCooperationOrderData.typeOfRealisationId;
                            if (typeOfRealisation) {
                                postCooperationOrderRequest.typeOfRealisationId = typeOfRealisation.recordId;
                            }
                            postCooperationOrderRequest.shippingTypeId = this.selectedCooperationOrderData.shippingTypeId;
                            if (shippingType) {
                                postCooperationOrderRequest.shippingTypeId = shippingType.recordId;
                            }
                            postCooperationOrderRequest.paymentTypeId = this.selectedCooperationOrderData.paymentTypeId;
                            if (paymentType) {
                                postCooperationOrderRequest.paymentTypeId = paymentType.recordId;
                            }
                            postCooperationOrderRequest.currencyId = this.selectedCooperationOrderData.currencyId;
                            if (currency) {
                                postCooperationOrderRequest.currencyId = currency.recordId;
                            }
                            postCooperationOrderRequest.workplaceId = this.selectedCooperationOrderData.workplaceId;
                            if (workplace) {
                                postCooperationOrderRequest.workplaceId = workplace.recordId;
                            }
                            postCooperationOrderRequest.valueAddedTaxId = this.selectedCooperationOrderData.valueAddedTaxId;
                            if (valueAddedTax) {
                                postCooperationOrderRequest.valueAddedTaxId = valueAddedTax.recordId;
                            }
                            if (priceCalculationType) {
                                postCooperationOrderRequest.priceCalculationType = priceCalculationType.value;
                            }

                            postCooperationOrderRequest.vatCalculationTypeId = this.selectedCooperationOrderData.vatCalculationTypeId;
                            if (vatCalculationType) {
                                postCooperationOrderRequest.vatCalculationTypeId = vatCalculationType.recordId;
                            }

                            postCooperationOrderRequest.cooperationOrderNumber = this.cooperationOrderDetailsForm.controls.cooperationOrderNumber.value;
                            postCooperationOrderRequest.description = this.cooperationOrderDetailsForm.controls.description.value;
                            postCooperationOrderRequest.bookedDate = this.cooperationOrderDetailsForm.controls.bookedDate.value;
                            postCooperationOrderRequest.discountString = this.cooperationOrderDetailsForm.controls.discount.value;
                            postCooperationOrderRequest.salesPriceString = this.cooperationOrderDetailsForm.controls.salesPrice.value;

                            this.documentBusy.busy.push(this.procurementService.createCooperationOrder(postCooperationOrderRequest).subscribe(
                                (success: PostCooperationOrderResponse) => {
                                    this.selectedCooperationOrderData = success;
                                    this.selectedCooperationOrderData["inEditMode"] = true;

                                    //we need to add new node to grid
                                    setTimeout(() => {
                                        var res = this.cooperationOrderGrid.api.applyTransaction({
                                            add: [this.selectedCooperationOrderData],
                                            addIndex: 0
                                        });

                                        //Only one node is added here, thus only one selected
                                        res.add.forEach((node: RowNode) => {
                                            node.setSelected(true);
                                        })
                                    }, 10);

                                    this.setDocumentActionPermissions();
                                    this.refreshSummaryTable();

                                    this.router.navigate(['procurement/cooperation/orders',
                                        {
                                            ofRowId: this.selectedCooperationOrderData.recordId,
                                            ofStatus: this.selectedStatus,
                                            ofDateFrom: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("start").value.toISOString()),
                                            ofDateTo: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("end").value.toISOString())
                                        }]);
                                },
                                (exception) => {
                                    var errorCode: ResultCodeEnum = exception.error.resultCode;
                                    var resultCode = "RESULT_CODES." + ResultCodeEnum[errorCode];

                                    this.translateService.get(["RESULT_CODES.error_title", resultCode]).subscribe(
                                        (tResult: string) => {
                                            //Remove from grid
                                            var res = this.cooperationOrderGrid.api.applyTransaction({ remove: [this.chosenCooperationOrderNode.data] });
                                            Swal.fire(tResult["RESULT_CODES.error_title"], tResult[resultCode], 'error');
                                        }
                                    )
                                }
                            ))
                        }
                    }
                }
            }
        });
    }

    //Action recalculate price on cooperation order
    onRecalculatePrice(event) {
        //Confirmation dialog
        let dialogRef = this.dialog.open(ConfirmationDialogComponent,
            {
                height: 'auto',
                width: '40%'
            });

        this.translateService.get(['SCREEN.PROCUREMENT.COOPERATIONORDERS.recalculate_action_title', 'DATA.yes', 'DATA.no', 'SCREEN.PROCUREMENT.COOPERATIONORDERS.recalculate_action_text']).subscribe((tResult: string) => {
            dialogRef.componentInstance.actionCancel = tResult["DATA.no"];
            dialogRef.componentInstance.actionYes = tResult["DATA.yes"];
            dialogRef.componentInstance.dialogText = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.recalculate_action_text"];
            dialogRef.componentInstance.dialogTitle = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.recalculate_action_title"];
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result && result === 'ok') {
                var postCooperationOrderRecalculatePriceRequest = new PostCooperationOrderRecalculatePriceRequest;
                postCooperationOrderRecalculatePriceRequest.cooperationOrderId = this.selectedCooperationOrderData.recordId;
                postCooperationOrderRecalculatePriceRequest.calculatePriceFromPositions = false;

                this.documentBusy.busy.push(this.procurementService.recalcualteCooperationOrderPrice(postCooperationOrderRecalculatePriceRequest).subscribe(
                    (success: PostCooperationOrderRecalculatePriceResponse) => {
                        //Correct price in selected order data
                        this.selectedCooperationOrderData.salesPrice = success.salesPrice;

                        //Correct input field
                        this.cooperationOrderDetailsForm.controls["salesPrice"].setValue(this.numberFormatter(success.salesPrice, this.locale));
                        this.cooperationOrderDetailsForm.controls["salesPrice"].updateValueAndValidity();
                    },
                    (exception) => {
                        var errorCode: ResultCodeEnum = exception.error.resultCode;
                        var resultCode = "RESULT_CODES." + ResultCodeEnum[errorCode];

                        this.translateService.get(["RESULT_CODES.error_title", resultCode]).subscribe(
                            (tResult: string) => {
                                Swal.fire(tResult["RESULT_CODES.error_title"], tResult[resultCode], 'error');
                            }
                        )
                    }));
            }
        });
    }

    onRecalculatePriceFromPositions(event) {
        //Confirmation dialog
        let dialogRef = this.dialog.open(ConfirmationDialogComponent,
            {
                height: 'auto',
                width: '40%'
            });

        this.translateService.get(['SCREEN.PROCUREMENT.COOPERATIONORDERS.recalculate_from_positions_action_title', 'DATA.yes', 'DATA.no', 'SCREEN.PROCUREMENT.COOPERATIONORDERS.recalculate_from_positions_action_text']).subscribe((tResult: string) => {
            dialogRef.componentInstance.actionCancel = tResult["DATA.no"];
            dialogRef.componentInstance.actionYes = tResult["DATA.yes"];
            dialogRef.componentInstance.dialogText = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.recalculate_from_positions_action_text"];
            dialogRef.componentInstance.dialogTitle = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.recalculate_from_positions_action_title"];
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result && result === 'ok') {
                var postCooperationOrderRecalculatePriceRequest = new PostCooperationOrderRecalculatePriceRequest;
                postCooperationOrderRecalculatePriceRequest.cooperationOrderId = this.selectedCooperationOrderData.recordId;
                postCooperationOrderRecalculatePriceRequest.calculatePriceFromPositions = true;

                this.documentBusy.busy.push(this.procurementService.recalcualteCooperationOrderPrice(postCooperationOrderRecalculatePriceRequest).subscribe(
                    (success: PostCooperationOrderRecalculatePriceResponse) => {
                        //Correct price in selected order data
                        this.selectedCooperationOrderData.salesPrice = success.salesPrice;

                        //Correct input field
                        this.cooperationOrderDetailsForm.controls["salesPrice"].setValue(this.numberFormatter(success.salesPrice, this.locale));
                        this.cooperationOrderDetailsForm.controls["salesPrice"].updateValueAndValidity();
                    },
                    (exception) => {
                        var errorCode: ResultCodeEnum = exception.error.resultCode;
                        var resultCode = "RESULT_CODES." + ResultCodeEnum[errorCode];

                        this.translateService.get(["RESULT_CODES.error_title", resultCode]).subscribe(
                            (tResult: string) => {
                                Swal.fire(tResult["RESULT_CODES.error_title"], tResult[resultCode], 'error');
                            }
                        )
                    }));
            }
        });
    }

    //HEADERS - create work order PDF report
    onReportCooperationOrder(params) {
        if (params && params.data) {
            this.generatePdfReportCooperationOrder(params.data)
        }
    }

    //Action closes supplier order on DocumentHead
    onCloseSupplierOrder() {
        if (this.selectedCooperationOrderData.recordId == 0) {
            this.selectedCooperationOrderData = {};
            this.showDocumentHeadEnabled = false;
            this.showDocumentPositionsEnabled = false;
        }
    }

    //Action confirms supplier order on DocumentHead
    onConfirmCooperationOrder(event) {
        //Confirmation dialog
        let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            height: 'auto',
            width: '40%'
        });

        this.translateService.get(['SCREEN.PROCUREMENT.COOPERATIONORDERS.confirm_action_title', 'DATA.yes', 'DATA.no', 'SCREEN.PROCUREMENT.COOPERATIONORDERS.confirm_action_text']).subscribe((tResult: string) => {
            dialogRef.componentInstance.actionCancel = tResult["DATA.no"];
            dialogRef.componentInstance.actionYes = tResult["DATA.yes"];
            dialogRef.componentInstance.dialogText = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.confirm_action_text"];
            dialogRef.componentInstance.dialogTitle = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.confirm_action_title"];
        });

        dialogRef.afterClosed().subscribe((result) => {

            if (result && result === 'ok') {
                var postCooperationOrderConfirmRequest = new PostCooperationOrderConfirmRequest;
                postCooperationOrderConfirmRequest.cooperationOrderId = this.selectedCooperationOrderData.recordId;
                this.documentBusy.busy.push(this.procurementService.confirmCooperationOrder(postCooperationOrderConfirmRequest).subscribe(
                    (success) => {
                        this.selectedCooperationOrderData.status = success.status;
                        this.selectedCooperationOrderData.bookingYear = success.bookingYear;
                        this.selectedCooperationOrderData.modifiedBy = success.modifiedBy;
                        this.selectedCooperationOrderData.modifiedDate = success.modifiedDate;

                        if (this.chosenCooperationOrderNode) {
                            this.chosenCooperationOrderNode.setData(this.selectedCooperationOrderData);
                            var res = this.cooperationOrdersGridOptions.api.applyTransaction({ remove: [this.chosenCooperationOrderNode.data] });
                        }

                        this.getPositions(this.selectedCooperationOrderData.recordId);
                        this.setDocumentActionPermissions();

                        setTimeout(() => {
                            this.router.navigate(['procurement/cooperation/orders',
                                {
                                    ofRowId: this.selectedCooperationOrderData.recordId,
                                    ofStatus: CooperationOrderStatusEnum.active,
                                    ofDateFrom: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("start").value.toISOString()),
                                    ofDateTo: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("end").value.toISOString())
                                }]);
                        }, 10);
                    },
                    (exception) => {
                        var errorCode: ResultCodeEnum = exception.error.resultCode;
                        var resultCode = "RESULT_CODES." + ResultCodeEnum[errorCode];

                        this.translateService.get(["RESULT_CODES.error_title", resultCode]).subscribe(
                            (tResult: string) => {
                                Swal.fire(tResult["RESULT_CODES.error_title"], tResult[resultCode], 'error');
                            }
                        )
                    }));
            }
        });
    }

    //Action opens supplier order on DocumentHead
    onOpenCooperationOrder(event) {
        //Confirmation dialog
        let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            height: 'auto',
            width: '40%'
        });

        this.translateService.get(['SCREEN.PROCUREMENT.COOPERATIONORDERS.open_action_title', 'DATA.yes', 'DATA.no', 'SCREEN.PROCUREMENT.COOPERATIONORDERS.open_action_text']).subscribe((tResult: string) => {
            dialogRef.componentInstance.actionCancel = tResult["DATA.no"];
            dialogRef.componentInstance.actionYes = tResult["DATA.yes"];
            dialogRef.componentInstance.dialogText = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.open_action_text"];
            dialogRef.componentInstance.dialogTitle = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.open_action_title"];
        });

        dialogRef.afterClosed().subscribe((result) => {

            if (result && result === 'ok') {
                var postCooperationOrderOpenRequest = new PostCooperationOrderOpenRequest;
                postCooperationOrderOpenRequest.cooperationOrderId = this.selectedCooperationOrderData.recordId;
                this.documentBusy.busy.push(this.procurementService.openCooperationOrder(postCooperationOrderOpenRequest).subscribe(
                    (success) => {
                        this.selectedCooperationOrderData.status = success.status;
                        this.selectedCooperationOrderData.bookingYear = success.bookingYear;
                        this.selectedCooperationOrderData.modifiedBy = success.modifiedBy;
                        this.selectedCooperationOrderData.modifiedDate = success.modifiedDate;

                        if (this.chosenCooperationOrderNode) {
                            this.chosenCooperationOrderNode.setData(this.selectedCooperationOrderData);
                            var res = this.cooperationOrdersGridOptions.api.applyTransaction({ remove: [this.chosenCooperationOrderNode.data] });
                        }

                        this.getPositions(this.selectedCooperationOrderData.recordId);
                        this.setDocumentActionPermissions();
                    },
                    (exception) => {
                        var errorCode: ResultCodeEnum = exception.error.resultCode;
                        var resultCode = "RESULT_CODES." + ResultCodeEnum[errorCode];

                        this.translateService.get(["RESULT_CODES.error_title", resultCode]).subscribe(
                            (tResult: string) => {
                                Swal.fire(tResult["RESULT_CODES.error_title"], tResult[resultCode], 'error');
                            }
                        )
                    }));
            }
        });
    }

    onCloseCooperationOrder(event) {
        //Confirmation dialog
        let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            height: 'auto',
            width: '40%'
        });

        this.translateService.get(['SCREEN.PROCUREMENT.COOPERATIONORDERS.close_action_title', 'DATA.yes', 'DATA.no', 'SCREEN.PROCUREMENT.COOPERATIONORDERS.close_action_text']).subscribe((tResult: string) => {
            dialogRef.componentInstance.actionCancel = tResult["DATA.no"];
            dialogRef.componentInstance.actionYes = tResult["DATA.yes"];
            dialogRef.componentInstance.dialogText = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.close_action_text"];
            dialogRef.componentInstance.dialogTitle = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.close_action_title"];
        });

        dialogRef.afterClosed().subscribe((result) => {

            if (result && result === 'ok') {
                var postCooperationOrderCloseRequest = new PostCooperationOrderCloseRequest;
                postCooperationOrderCloseRequest.cooperationOrderId = this.selectedCooperationOrderData.recordId;
                this.documentBusy.busy.push(this.procurementService.closeCooperationOrder(postCooperationOrderCloseRequest).subscribe(
                    (success) => {
                        this.selectedCooperationOrderData.status = success.status;
                        this.selectedCooperationOrderData.bookingYear = success.bookingYear;
                        this.selectedCooperationOrderData.modifiedBy = success.modifiedBy;
                        this.selectedCooperationOrderData.modifiedDate = success.modifiedDate;

                        if (this.chosenCooperationOrderNode) {
                            this.chosenCooperationOrderNode.setData(this.selectedCooperationOrderData);
                            var res = this.cooperationOrdersGridOptions.api.applyTransaction({ remove: [this.chosenCooperationOrderNode.data] });
                        }

                        this.getPositions(this.selectedCooperationOrderData.recordId);
                        this.setDocumentActionPermissions();
                    },
                    (exception) => {
                        var errorCode: ResultCodeEnum = exception.error.resultCode;
                        var resultCode = "RESULT_CODES." + ResultCodeEnum[errorCode];

                        this.translateService.get(["RESULT_CODES.error_title", resultCode]).subscribe(
                            (tResult: string) => {
                                Swal.fire(tResult["RESULT_CODES.error_title"], tResult[resultCode], 'error');
                            }
                        )
                    }));
            }
        });
    }

    //Action copies supplier order on DocumentHead
    onCopyCooperationOrder(event) {
        //Confirmation dialog
        let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            height: 'auto',
            width: '40%'
        });

        this.translateService.get(['SCREEN.PROCUREMENT.COOPERATIONORDERS.copy_action_title', 'DATA.yes', 'DATA.no', 'SCREEN.PROCUREMENT.COOPERATIONORDERS.copy_action_text']).subscribe((tResult: string) => {
            dialogRef.componentInstance.actionCancel = tResult["DATA.no"];
            dialogRef.componentInstance.actionYes = tResult["DATA.yes"];
            dialogRef.componentInstance.dialogText = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.copy_action_text"];
            dialogRef.componentInstance.dialogTitle = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.copy_action_title"];
        });

        dialogRef.afterClosed().subscribe((result) => {

            if (result && result === 'ok') {
                var postCooperationOrderCopyRequest = new PostCooperationOrderCopyRequest;
                postCooperationOrderCopyRequest.cooperationOrderId = this.selectedCooperationOrderData.recordId;
                this.documentBusy.busy.push(this.procurementService.copyCooperationOrder(postCooperationOrderCopyRequest).subscribe(
                    (success) => {
                        success["inEditMode"] = true;
                        this.cooperationOrderGrid.api.applyTransaction({
                            add: [success],
                            addIndex: 0
                        });

                        this.currentTabIndex = 0;
                    },
                    (exception) => {
                        var errorCode: ResultCodeEnum = exception.error.resultCode;
                        var resultCode = "RESULT_CODES." + ResultCodeEnum[errorCode];

                        this.translateService.get(["RESULT_CODES.error_title", resultCode]).subscribe(
                            (tResult: string) => {
                                Swal.fire(tResult["RESULT_CODES.error_title"], tResult[resultCode], 'error');
                            }
                        )
                    }));
            }
        });
    }

    //Action deletes supplier order on DocumentHead
    onDeleteCooperationOrder(event) {
        //Confirmation dialog
        let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            height: 'auto',
            width: '40%'
        });

        this.translateService.get(['FORMS.FIELDS.remove_supplierorder_title', 'DATA.yes', 'DATA.no', 'FORMS.FIELDS.remove_supplierorder_text']).subscribe((tResult: string) => {
            dialogRef.componentInstance.actionCancel = tResult["DATA.no"];
            dialogRef.componentInstance.actionYes = tResult["DATA.yes"];
            dialogRef.componentInstance.dialogText = tResult["FORMS.FIELDS.remove_supplierorder_text"];
            dialogRef.componentInstance.dialogTitle = tResult["FORMS.FIELDS.remove_supplierorder_title"];
        });

        dialogRef.afterClosed().subscribe((result) => {

            if (result && result === 'ok') {
                var deleteCooperationOrderRequest = new DeleteCooperationOrderRequest;
                deleteCooperationOrderRequest.cooperationOrderId = this.selectedCooperationOrderData.recordId;
                this.documentBusy.busy.push(this.procurementService.deleteCooperationOrder(deleteCooperationOrderRequest).subscribe(
                    (success) => {
                        this.router.navigate(['procurement/cooperation/orders',
                            {
                                ofStatus: this.selectedStatus,
                                ofDateFrom: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("start").value.toISOString()),
                                ofDateTo: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("end").value.toISOString())
                            }]);
                    },
                    (exception) => {
                        var errorCode: ResultCodeEnum = exception.error.resultCode;
                        var resultCode = "RESULT_CODES." + ResultCodeEnum[errorCode];

                        this.translateService.get(["RESULT_CODES.error_title", resultCode]).subscribe(
                            (tResult: string) => {
                                Swal.fire(tResult["RESULT_CODES.error_title"], tResult[resultCode], 'error');
                            }
                        )
                    }));
            }
        });
    }

    //Action cancels supplier order on DocumentHead
    onCancelCooperationOrder(event) {
        //? Canceling cooperation order is currently disabled, but leave this here if you need it future

        // //Confirmation dialog
        // let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        //     height: 'auto',
        //     width: '40%'
        // });

        // this.translateService.get(['SCREEN.PROCUREMENT.COOPERATIONORDERS.cancel_action_title', 'DATA.yes', 'DATA.no', 'SCREEN.PROCUREMENT.COOPERATIONORDERS.cancel_action_text']).subscribe((tResult: string) => {
        //     dialogRef.componentInstance.actionCancel = tResult["DATA.no"];
        //     dialogRef.componentInstance.actionYes = tResult["DATA.yes"];
        //     dialogRef.componentInstance.dialogText = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.cancel_action_text"];
        //     dialogRef.componentInstance.dialogTitle = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.cancel_action_title"];
        // });

        // dialogRef.afterClosed().subscribe((result) => {

        //     if (result && result === 'ok') {
        //         var postCooperationOrderCancelRequest = new PostCooperationOrderCancelRequest;
        //         postCooperationOrderCancelRequest.cooperationOrderId = this.selectedCooperationOrderData.recordId;
        //         this.documentBusy.busy.push(this.procurementService.cancelCooperationOrder(postCooperationOrderCancelRequest).subscribe(
        //             (success) => {
        //                 this.selectedCooperationOrderData.status = success.status;
        //                 this.selectedCooperationOrderData.bookingYear = success.bookingYear;
        //                 this.selectedCooperationOrderData.modifiedBy = success.modifiedBy;
        //                 this.selectedCooperationOrderData.modifiedDate = success.modifiedDate;

        //                 this.chosenCooperationOrderNode.setData(this.selectedCooperationOrderData);
        //                 this.getPositions(this.selectedCooperationOrderData.recordId);
        //                 this.setDocumentActionPermissions();
        //             },
        //             (exception) => {
        //                 var errorCode: ResultCodeEnum = exception.error.resultCode;
        //                 var resultCode = "RESULT_CODES." + ResultCodeEnum[errorCode];

        //                 this.translateService.get(["RESULT_CODES.error_title", resultCode]).subscribe(
        //                     (tResult: string) => {
        //                         Swal.fire(tResult["RESULT_CODES.error_title"], tResult[resultCode], 'error');
        //                     }
        //                 )
        //             }));
        //     }
        // });
    }

    //Triggers when document type is changed
    onDocumentTypeChanged(event) {
        this.selectedCooperationOrderData.documentType = this.documentTypeData.filter(el => el.recordId === event.value)[0];
        this.selectedCooperationOrderData.documentTypeId = this.selectedCooperationOrderData.documentType.recordId;
    }
    //Clears document type on DocumentHead dropdown
    onClearDocumentType() {
        this.cooperationOrderDetailsForm.controls["documentTypeId"].setValue(null);
        this.cooperationOrderDetailsForm.controls["documentTypeId"].markAsTouched();
        this.cooperationOrderDetailsForm.controls["documentTypeId"].updateValueAndValidity();

        this.selectedCooperationOrderData.documentTypeId = null;
        this.selectedCooperationOrderData.documentType = null;
    }

    onClearWorkplace() {
        this.cooperationOrderDetailsForm.controls["workplace"].setValue(null);
        this.cooperationOrderDetailsForm.controls["workplace"].updateValueAndValidity();

        this.cooperationOrderDetailsForm.controls["workplaceId"].setValue(null);
        this.cooperationOrderDetailsForm.controls["workplaceId"].updateValueAndValidity();

        this.cooperationOrderDetailsForm.controls["workplaceName"].setValue("");
        this.cooperationOrderDetailsForm.controls["workplaceName"].updateValueAndValidity();
    }

    onClearPriceCalculationType() {
        this.cooperationOrderDetailsForm.controls["priceCalculationType"].setValue(null);
        this.cooperationOrderDetailsForm.controls["priceCalculationType"].updateValueAndValidity();

        this.cooperationOrderDetailsForm.controls["priceCalculationTypeId"].setValue(null);
        this.cooperationOrderDetailsForm.controls["priceCalculationTypeId"].updateValueAndValidity();

        this.cooperationOrderDetailsForm.controls["priceCalculationTypeName"].setValue("");
        this.cooperationOrderDetailsForm.controls["priceCalculationTypeName"].updateValueAndValidity();
    }

    //! DOCUMENT POSITION ACTIONS

    //Adds new position to the grid
    onAddNewPosition() {

        var filter = {
            workplaceId: this.selectedCooperationOrderData.workplaceId
        };

        let dialogRef = this.dialog.open(CooperationWorkOrderOperationsDialogComponent,
            {
                height: '90%',
                width: '90%',
                panelClass: 'code-table-dialog',
                disableClose: true,
                data: filter
            });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === "cancel" || result == null) {
                return;
            }

            var selectedIds = [];
            result.forEach((item) => {
                selectedIds.push(item.recordId);
            });

            var postData = new PostCooperationOrderPositionsRequest();
            postData.cooperationOrderId = this.selectedCooperationOrderData.recordId;
            postData.keys = selectedIds;

            this.cooperationOrderPositionGridBusy.busy.push(this.procurementService.createCooperationOrderPositions(postData).subscribe(
                (success) => {
                    this.refreshSummaryTable();
                    this.getPositions(this.selectedCooperationOrderData.recordId);
                },
                (exception) => {
                    var errorCode: ResultCodeEnum = exception.error.resultCode;
                    var resultCode = "RESULT_CODES." + ResultCodeEnum[errorCode];

                    this.translateService.get(["RESULT_CODES.error_title", resultCode]).subscribe(
                        (tResult: string) => {
                            Swal.fire(tResult["RESULT_CODES.error_title"], tResult[resultCode], 'error');
                        }
                    )
                }
            ))


        });

    }

    //Creates or updates supplier order positions
    onSaveOrUpdateCooperationOrderPosition(event) {
        var rowData: CooperationOrderPositionData = event.data;
        var rowNode: RowNode = event.node;

        if (this.escapePressed) {
            this.escapePressed = false;
            if (rowData.recordId == 0) {
                var res = this.cooperationOrderPositionGrid.api.applyTransaction({ remove: [rowNode.data] });
            }
            return;
        }

        var allowedToSave = super.allowedToSave(event, this.dialog);

        if (!allowedToSave || rowData.status != DocumentStatusCodeEnum.preparation) {
            return;
        }

        if (!this.objectHasEmptyNullValues(rowData)) {
            if (rowData) {
                if (rowData.recordId) {
                    var putData = new PutCooperationOrderPositionRequest();
                    putData.cooperationOrderPositionId = rowData.recordId;
                    putData.workorderOperationId = rowData.workOrderOperationId;

                    putData.valueAddedTaxId = rowData.valueAddedTaxId;
                    if (rowData.valueAddedTax) {
                        putData.valueAddedTaxId = rowData.valueAddedTax.recordId;
                    }
                    putData.description = rowData.description;

                    if (rowData.quantityOrder) {
                        putData.quantityString = rowData.quantityOrder.toString();
                    }
                    if (rowData.salesPrice) {
                        putData.salesPriceString = rowData.salesPrice.toString();
                    }
                    if (rowData.discount) {
                        putData.discountString = rowData.discount.toString();
                    }
                    putData.deliveryDate = rowData.deliveryDate;

                    this.cooperationOrderPositionGridBusy.busy.push(this.procurementService.updateCooperationOrderPosition(putData).subscribe(
                        (success) => {
                            rowData.modifiedBy = success.modifiedBy;
                            rowData.modifiedDate = success.modifiedDate;
                            rowData.salesPrice = success.salesPrice;
                            rowData.discount = success.discount;
                            rowData.quantityOrder = success.quantity;
                            //Mark edited row on the grid
                            rowData["inEditMode"] = true;
                            rowNode.setData(rowData);

                            this.refreshSummaryTable();
                        },
                        (exception) => {
                            var errorCode: ResultCodeEnum = exception.error.resultCode;
                            var resultCode = "RESULT_CODES." + ResultCodeEnum[errorCode];

                            this.translateService.get(["RESULT_CODES.error_title", resultCode]).subscribe(
                                (tResult: string) => {
                                    Swal.fire(tResult["RESULT_CODES.error_title"], tResult[resultCode], 'error');
                                }
                            )
                        }
                    ))
                }
                else {
                    //Should never come here
                    //Creating positions is done through dialog
                }
            }
        }
        else {
            //Remove from grid
            var res = this.cooperationOrderPositionGrid.api.applyTransaction({ remove: [rowNode.data] });
        }
    }


    private handleEmptyGridColumns(documentId: number, rowNode: RowNode) {
        switch (documentId) {
            //DocumentPositions
            case 1:

                if (this.cooperationOrderPositionGrid) {
                    var nodes = this.cooperationOrderPositionGrid.api.getRenderedNodes();

                    if (nodes.filter(x => !x.data.recordId).length > 0) {
                        rowNode = nodes[0];
                        this.cooperationOrderPositionGrid.api.applyTransaction({ remove: [rowNode.data] });
                    }
                }

                break;

            //SavingPostions
            case 2:
                break;

            default:
                break;
        }
    }

    //! CONTEXT MENUS START

    //Menu, when user right clicks on supplier orders ag-grid
    getCooperationOrderContextMenuItems(params) {
        var result = [];
        var context: CooperationOrderComponent = params.context;
        var copy = "copy";
        var separator = "separator";
        var rowNode: RowNode = params.node;
        var gridApi: GridApi = params.api;
        var rowData: CooperationOrderData = params.node?.data;

        setTimeout(() => {
            if (rowNode) {
                if (gridApi.getSelectedNodes().length > 1) {
                    rowNode.setSelected(true);
                }
                else {
                    rowNode.setSelected(true, true);
                }

            }
        }, 1);

        var viewAction = {
            name: params.context.translateService.instant("FORMS.FIELDS.view"),
            action: function () {
                setTimeout(() => {
                    rowNode.setSelected(true);
                }, 1);

                context.onCooperationOrderDetails({ data: rowNode.data, node: rowNode });

            },
            icon: "<span class='fa fa-asterisk'></span>"
        };

        var exportExcel = {
            name: context.translateService.instant("FORMS.FIELDS.exportExcel"),
            action: function () {
                params.api.exportDataAsExcel();
            },
            icon: "<span class='fa fa-file-excel-o'></span>"
        };

        if (context.hasReadPermissions) {
            result.push(viewAction);
        }

        if (context.hasReadPermissions) {
            result.push(separator);
            result.push(exportExcel);
        }
        return result;
    }

    //Build the menu, when user right clicks on positions ag-grid
    getPositionContextMenuItems(params) {
        var result = [];
        var context: CooperationOrderComponent = params.context;
        var copy = "copy";
        var rowNode: RowNode = params.node;
        var rowData: CooperationOrderPositionData = params.node?.data;
        var gridApi: GridApi = params.api;

        setTimeout(() => {
            if (rowNode) {
                if (gridApi.getSelectedNodes().length > 1) {
                    rowNode.setSelected(true);
                }
                else {
                    rowNode.setSelected(true, true);
                }

            }
        }, 1);

        var editAction = {
            name: params.context.translateService.instant("FORMS.FIELDS.edit"),
            action: function () {
                //size grids
                setTimeout(() => {

                    gridApi.startEditingCell({ rowIndex: rowNode.rowIndex, colKey: 'salesPrice' });

                    var dropdownElement = {
                        objectName: CodetableTypeEnum.product,
                        items: context.positionProductData
                    }
                    context.agGridService.onDropdownUpdate(dropdownElement);

                }, 1);
            },
            icon: "<span class='fas fa-pencil-alt'></span>"
        };

        var deleteAction = {
            name: params.context.translateService.instant("FORMS.FIELDS.delete"),
            action: function () {

                setTimeout(() => {
                    rowNode.setSelected(true, true);
                }, 1);

                //Confirmation dialog
                let dialogRef = context.dialog.open(ConfirmationDialogComponent, {
                    height: 'auto',
                    width: '40%'
                });

                context.translateService.get(['SCREEN.PROCUREMENT.COOPERATIONORDERS.delete_position_action_title', 'DATA.yes', 'DATA.no', 'SCREEN.PROCUREMENT.COOPERATIONORDERS.delete_position_action_text']).subscribe((tResult: string) => {
                    dialogRef.componentInstance.actionCancel = tResult["DATA.no"];
                    dialogRef.componentInstance.actionYes = tResult["DATA.yes"];
                    dialogRef.componentInstance.dialogText = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.delete_position_action_text"];
                    dialogRef.componentInstance.dialogTitle = tResult["SCREEN.PROCUREMENT.COOPERATIONORDERS.delete_position_action_title"];
                });

                dialogRef.afterClosed().subscribe((result) => {

                    if (result && result === 'ok') {
                        if (rowNode.data && rowNode.data.recordId) {
                            //remove from server
                            var deleteRequest: DeleteCooperationOrderPositionRequest = new DeleteCooperationOrderPositionRequest();
                            deleteRequest.cooperationOrderPositionId = rowNode.data.recordId;
                            context.cooperationOrderPositionGridBusy.busy.push(context.procurementService.deleteCooperationOrderPosition(deleteRequest).subscribe(
                                (success) => {
                                    context.refreshSummaryTable();
                                    context.getPositions(context.chosenCooperationOrderNode.data.recordId);
                                },
                                (exception) => {
                                    var errorCode: ResultCodeEnum = exception.error.resultCode;
                                    var resultCode = "RESULT_CODES." + ResultCodeEnum[errorCode];

                                    context.translateService.get(["RESULT_CODES.error_title", resultCode]).subscribe(
                                        (tResult: string) => {
                                            Swal.fire(tResult["RESULT_CODES.error_title"], tResult[resultCode], 'error');
                                        }
                                    )
                                }
                            ))
                        }
                        else {
                            //remove from client only
                            var res = gridApi.applyTransaction({ remove: [rowNode] });
                        }
                    };
                })
            },
            icon: "<span class='fas fa-trash-alt'></span>"
        }

        if (params.context.hasReadWritePermissions) {
            if (rowData && rowData.status == DocumentStatusCodeEnum.preparation) {
                result.push(editAction);
                result.push(deleteAction);
            }
        }
        result.push(copy);

        return result;
    }

    //! DIALOGS START

    //Opens dialog for choosing type of realisation
    onShowTypeOfRealisationDialog() {
        let dialogRef = this.dialog.open(TypeOfRealisationComponent, {
            height: '90%',
            width: '90%',
            panelClass: 'code-table-dialog',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === "cancel" || result == null) {
                return;
            }

            this.cooperationOrderDetailsForm.controls["typeOfRealisationName"].setValue(result.name);
            this.cooperationOrderDetailsForm.controls["typeOfRealisationName"].updateValueAndValidity();
            this.cooperationOrderDetailsForm.controls["typeOfRealisation"].setValue(result);
            this.cooperationOrderDetailsForm.controls["typeOfRealisation"].updateValueAndValidity();
        });
    }

    //Opens dialog for choosing shipping type
    onShowShippingTypeDialog() {
        let dialogRef = this.dialog.open(ShippingTypeComponent, {
            height: '90%',
            width: '90%',
            panelClass: 'code-table-dialog',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === "cancel" || result == null) {
                return;
            }

            this.cooperationOrderDetailsForm.controls["shippingTypeName"].setValue(result.name);
            this.cooperationOrderDetailsForm.controls["shippingTypeName"].updateValueAndValidity();
            this.cooperationOrderDetailsForm.controls["shippingType"].setValue(result);
            this.cooperationOrderDetailsForm.controls["shippingType"].updateValueAndValidity();
        });
    }

    //Opens dialog for choosing project
    onShowProjectDialog() {
        let dialogRef = this.dialog.open(ProjectComponent, {
            height: '90%',
            width: '90%',
            panelClass: 'code-table-dialog',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === "cancel" || result == null) {
                return;
            }

            this.cooperationOrderDetailsForm.controls["projectName"].setValue(result.name);
            this.cooperationOrderDetailsForm.controls["projectName"].updateValueAndValidity();
            this.cooperationOrderDetailsForm.controls["project"].setValue(result);
            this.cooperationOrderDetailsForm.controls["project"].updateValueAndValidity();
        });
    }

    //Opens dialog for choosing supplier
    onShowSupplierDialog() {
        let dialogRef = this.dialog.open(SupplierComponent, {
            height: '90%',
            width: '90%',
            panelClass: 'code-table-dialog',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === "cancel" || result == null) {
                return;
            }

            this.cooperationOrderDetailsForm.controls["supplierName"].setValue(result.name);
            this.cooperationOrderDetailsForm.controls["supplierName"].updateValueAndValidity();
            this.cooperationOrderDetailsForm.controls["supplier"].setValue(result);
            this.cooperationOrderDetailsForm.controls["supplier"].updateValueAndValidity();

            if (result.paymentType) {
                this.cooperationOrderDetailsForm.controls["paymentTypeName"].setValue(result.paymentType.name);
                this.cooperationOrderDetailsForm.controls["paymentTypeName"].updateValueAndValidity();
                this.cooperationOrderDetailsForm.controls["paymentType"].setValue(result.paymentType);
                this.cooperationOrderDetailsForm.controls["paymentType"].updateValueAndValidity();
            }
            if (result.shippingType) {
                this.cooperationOrderDetailsForm.controls["shippingTypeName"].setValue(result.shippingType.name);
                this.cooperationOrderDetailsForm.controls["shippingTypeName"].updateValueAndValidity();
                this.cooperationOrderDetailsForm.controls["shippingType"].setValue(result.shippingType);
                this.cooperationOrderDetailsForm.controls["shippingType"].updateValueAndValidity();
            }
            if (result.valueAddedTax) {
                this.cooperationOrderDetailsForm.controls["valueAddedTaxName"].setValue(result.valueAddedTax.name);
                this.cooperationOrderDetailsForm.controls["valueAddedTaxName"].updateValueAndValidity();
                this.cooperationOrderDetailsForm.controls["valueAddedTax"].setValue(result.valueAddedTax);
                this.cooperationOrderDetailsForm.controls["valueAddedTax"].updateValueAndValidity();
            }
            if (result.currency) {
                this.cooperationOrderDetailsForm.controls["currencyName"].setValue(result.currency.name);
                this.cooperationOrderDetailsForm.controls["currencyName"].updateValueAndValidity();
                this.cooperationOrderDetailsForm.controls["currency"].setValue(result.currency);
                this.cooperationOrderDetailsForm.controls["currency"].updateValueAndValidity();
            }
            if (result.typeOfRealisation) {
                this.cooperationOrderDetailsForm.controls["typeOfRealisationName"].setValue(result.typeOfRealisation.name);
                this.cooperationOrderDetailsForm.controls["typeOfRealisationName"].updateValueAndValidity();
                this.cooperationOrderDetailsForm.controls["typeOfRealisation"].setValue(result.typeOfRealisation);
                this.cooperationOrderDetailsForm.controls["typeOfRealisation"].updateValueAndValidity();
            }
            if (result.vatCalculationType) {
                this.cooperationOrderDetailsForm.controls["vatCalculationTypeId"].setValue(result.vatCalculationType.recordId);
                this.cooperationOrderDetailsForm.controls["vatCalculationTypeId"].updateValueAndValidity();
                this.cooperationOrderDetailsForm.controls["vatCalculationTypeName"].setValue(result.vatCalculationType.name);
                this.cooperationOrderDetailsForm.controls["vatCalculationTypeName"].updateValueAndValidity();
                this.cooperationOrderDetailsForm.controls["vatCalculationType"].setValue(result.vatCalculationType);
                this.cooperationOrderDetailsForm.controls["vatCalculationType"].updateValueAndValidity();
            }
        });
    }

    //Opens dialog for choosing payment type
    onShowPaymentTypeDialog() {
        let dialogRef = this.dialog.open(PaymentTypeComponent, {
            height: '90%',
            width: '90%',
            panelClass: 'code-table-dialog',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === "cancel" || result == null) {
                return;
            }

            this.cooperationOrderDetailsForm.controls["paymentTypeName"].setValue(result.name);
            this.cooperationOrderDetailsForm.controls["paymentTypeName"].updateValueAndValidity();
            this.cooperationOrderDetailsForm.controls["paymentType"].setValue(result);
            this.cooperationOrderDetailsForm.controls["paymentType"].updateValueAndValidity();
        });
    }

    //Opens dialog for choosing currency
    onShowCurrencyDialog() {
        let dialogRef = this.dialog.open(CurrencyComponent, {
            height: '90%',
            width: '90%',
            panelClass: 'code-table-dialog',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === "cancel" || result == null) {
                return;
            }

            this.cooperationOrderDetailsForm.controls["currencyName"].setValue(result.name);
            this.cooperationOrderDetailsForm.controls["currencyName"].updateValueAndValidity();
            this.cooperationOrderDetailsForm.controls["currency"].setValue(result);
            this.cooperationOrderDetailsForm.controls["currency"].updateValueAndValidity();
        });
    }

    onShowWorkplaceDialog() {
        var filter = {
            code: this.translateService.instant("SCREEN.CODETABLE.WORKPLACE.cooperation"),
            name: this.translateService.instant("SCREEN.CODETABLE.WORKPLACE.cooperation")
        };

        let dialogRef = this.dialog.open(WorkplaceComponent, {
            height: '90%',
            width: '90%',
            panelClass: 'code-table-dialog',
            disableClose: true,
            data: { filter }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === "cancel" || result == null) {
                return;
            }

            var workplace: WorkplaceData = result;

            this.cooperationOrderDetailsForm.controls["workplace"].setValue(workplace);
            this.cooperationOrderDetailsForm.controls["workplace"].updateValueAndValidity();

            this.cooperationOrderDetailsForm.controls["workplaceName"].setValue(workplace.name);
            this.cooperationOrderDetailsForm.controls["workplaceName"].updateValueAndValidity();
        });
    }

    onShowValueAddedTaxDialog() {
        let dialogRef = this.dialog.open(ValueAddedTaxComponent, {
            height: '90%',
            width: '90%',
            panelClass: 'code-table-dialog',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === "cancel" || result == null) {
                return;
            }

            var vat: ValueAddedTaxData = result;

            this.cooperationOrderDetailsForm.controls["valueAddedTax"].setValue(vat);
            this.cooperationOrderDetailsForm.controls["valueAddedTax"].updateValueAndValidity();

            this.cooperationOrderDetailsForm.controls["valueAddedTaxName"].setValue(vat.name);
            this.cooperationOrderDetailsForm.controls["valueAddedTaxName"].updateValueAndValidity();
        });
    }

    onShowPriceCalculationTypeDialog() {
        let dialogRef = this.dialog.open(ProductPriceCalculationTypeDialogComponent, {
            height: '90%',
            width: '90%',
            panelClass: 'code-table-dialog',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === "cancel" || result == null) {
                return;
            }

            var vat: ValueAddedTaxData = result;

            this.cooperationOrderDetailsForm.controls["priceCalculationType"].setValue(vat);
            this.cooperationOrderDetailsForm.controls["priceCalculationType"].updateValueAndValidity();

            this.cooperationOrderDetailsForm.controls["priceCalculationTypeName"].setValue(vat.name);
            this.cooperationOrderDetailsForm.controls["priceCalculationTypeName"].updateValueAndValidity();
        });
    }

    onSelectVatCalculationType(result) {
        var vatCalculationType = this.vatCalculationTypesList.filter(el => el.recordId === result.value)[0];

        this.selectedCooperationOrderData.vatCalculationType = vatCalculationType;

        if (this.selectedCooperationOrderData && this.selectedCooperationOrderData.vatCalculationType) {
            this.cooperationOrderDetailsForm.controls["vatCalculationType"].setValue(null);
            this.cooperationOrderDetailsForm.controls["vatCalculationType"].updateValueAndValidity();
            this.cooperationOrderDetailsForm.controls["vatCalculationTypeId"].setValue(null);
            this.cooperationOrderDetailsForm.controls["vatCalculationTypeId"].updateValueAndValidity();
            this.cooperationOrderDetailsForm.controls["vatCalculationTypeName"].setValue(null);
            this.cooperationOrderDetailsForm.controls["vatCalculationTypeName"].updateValueAndValidity();
            if (this.selectedCooperationOrderData.vatCalculationType) {
                this.cooperationOrderDetailsForm.controls["vatCalculationType"].setValue(this.selectedCooperationOrderData.vatCalculationType);
                this.cooperationOrderDetailsForm.controls["vatCalculationType"].updateValueAndValidity();
                this.cooperationOrderDetailsForm.controls["vatCalculationTypeId"].setValue(this.selectedCooperationOrderData.vatCalculationType.recordId);
                this.cooperationOrderDetailsForm.controls["vatCalculationTypeId"].updateValueAndValidity();
                this.cooperationOrderDetailsForm.controls["vatCalculationTypeName"].setValue(this.selectedCooperationOrderData.vatCalculationType.name);
                this.cooperationOrderDetailsForm.controls["vatCalculationTypeName"].updateValueAndValidity();
            }
        }
    }

    //! Private Methods START

    private getScreenData(coopearationOrderId?: number, cooperationOrderStatus?: CooperationOrderStatusEnum, dateFrom?: string, dateTo?: string) {

        //Handle cooperationorder request
        let cooperationOrderRequest = null;
        if (coopearationOrderId) {
            if (coopearationOrderId != 0) {
                var getCooperationOrderRequest = new GetCooperationOrderRequest();
                getCooperationOrderRequest.recordId = coopearationOrderId;
                cooperationOrderRequest = this.procurementService.getCooperationOrder(getCooperationOrderRequest);
            }
            else {
                //We are creating new coopearation order, so we do not need to call API
                cooperationOrderRequest = of(null);
            }
        }
        else {
            var getCooperationOrderRequest = new GetCooperationOrderRequest();
            if (cooperationOrderStatus) {
                getCooperationOrderRequest.status = CooperationOrderStatusEnum[cooperationOrderStatus];
            }
            else {
                getCooperationOrderRequest.status = CooperationOrderStatusEnum[this.selectedStatus];
            }
            if (dateFrom) {
                getCooperationOrderRequest.startDate = dateFrom;
            }
            else {
                getCooperationOrderRequest.startDate = this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("start").value.toISOString());
            }

            if (dateTo) {
                getCooperationOrderRequest.endDate = dateTo;
            }
            else {
                getCooperationOrderRequest.endDate = this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("end").value.toISOString());
            }

            cooperationOrderRequest = this.procurementService.getCooperationOrder(getCooperationOrderRequest);
        }



        this.documentBusy.busy.push(forkJoin({
            cooperationOrders: cooperationOrderRequest,
            documentTypes: this.codeTableService.getDocumentTypesScreen(new GetDocumentTypeScreenRequest())
        }).subscribe(({ cooperationOrders, documentTypes }) => {

            //Loading the specific order
            if (cooperationOrders != null) {
                if (coopearationOrderId) {
                    this.selectedCooperationOrderData = cooperationOrders["data"][0];

                    //Loads position tabs
                    if (this.selectedCooperationOrderData && this.selectedCooperationOrderData.recordId) {
                        this.getPositions(this.selectedCooperationOrderData.recordId);
                    }

                    //Select the right node in grid
                    var renderedNodes = this.cooperationOrderGrid.api.getRenderedNodes();
                    renderedNodes.forEach(node => {
                        if (node.data.recordId == coopearationOrderId) {
                            node.setSelected(true, true);
                            this.cooperationOrderGrid.api.ensureIndexVisible(node.rowIndex);
                        }
                    })
                }
                //Loading all orders
                else {
                    this.cooperationOrdersData = cooperationOrders["data"];
                    this.documentTypeData = documentTypes.data;
                }
            }

            var supplierOrderColumnDef: any = this.getStaticColumns();
            this.cooperationOrderGrid.api.setColumnDefs([]);
            this.cooperationOrderGrid.api.setColumnDefs(supplierOrderColumnDef);

            this.setDocumentActionPermissions();

            this.getAgGridState(ScreenTypeFactoryEnum.cooperationOrdersScreen, this.cooperationOrdersGridOptions);
        }));
    }

    private getVATCalculationTypes() {
        var getRequest = new GetVATCalculationTypesRequest();

        this.documentBusy.busy.push(this.salesService.getVATCalculationTypes(getRequest).subscribe(
            (success) => {
                this.vatCalculationTypesList = success.data;
            },
            (exception) => {
                var errorCode: ResultCodeEnum = exception.error.resultCode;
                var resultCode = "RESULT_CODES." + ResultCodeEnum[errorCode];

                this.translateService.get(["RESULT_CODES.error_title", resultCode]).subscribe(
                    (tResult: string) => {
                        Swal.fire(tResult["RESULT_CODES.error_title"], tResult[resultCode], 'error');
                    }
                )
            }
        ))
    }

    private getStaticColumns() {
        var staticColumnDef = [
            {
                headerName: "FORMS.FIELDS.state",
                field: "status",
                sortable: true,
                editable: false,
                width: 80,
                filter: 'agSetColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                    valueFormatter: (params) => this.statusValueFormatter(params)
                },
                headerValueGetter: this.localizeHeader.bind(this),
                tooltipValueGetter: (params) => params.value,
                cellRenderer: function (params) {
                    if (params.data != null && params.data.status != null) {
                        if (params.data.status == DocumentStatusCodeEnum.active) {
                            return '<center><div class="circle_green" style="margin-top: 8px;" /></center>';
                        }
                        else if (params.data.status == DocumentStatusCodeEnum.canceled) {
                            return '<center><div class="circle_red" style="margin-top: 8px;" /></center>';
                        }
                        else if (params.data.status == DocumentStatusCodeEnum.preparation) {
                            return '<center><div class="circle_orange" style="margin-top: 8px;" /></center>';
                        }
                        else if (params.data.status == DocumentStatusCodeEnum.completed) {
                            return '<center><div class="fas fa-check-circle circle_completed" style="margin-top: 8px;" /></center>';
                        }
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.order_number",
                field: "code",
                sortable: true,
                editable: false,
                filter: 'agTextColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this)
            },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.documentType",
                field: "documentTypeName",
                sortable: true,
                editable: false,
                filter: 'agSetColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this)
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.cooperant",
                field: "supplierName",
                sortable: true,
                editable: false,
                filter: 'agSetColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this)
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.cooperationOrderNumber",
                field: "cooperationOrderNumber",
                sortable: true,
                editable: false,
                filter: 'agTextColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this)
            },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.typeOfRealisation",
                field: "typeOfRealisationName",
                sortable: true,
                editable: false,
                filter: 'agSetColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this)
            },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.project",
                field: "projectName",
                sortable: true,
                editable: false,
                filter: 'agSetColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this)
            },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.createdDate",
                field: "createdDate",
                sortable: true,
                editable: false,
                width: 150,
                filter: 'agDateColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                    comparator: this.getDateFilterComparator
                },
                headerValueGetter: this.localizeHeader.bind(this),
                cellRenderer: (params) => this.dateFormatter(params, 'medium')
            },
            {
                headerName: "SCREEN.modified_date",
                field: "modifiedDate",
                sortable: true,
                editable: false,
                width: 150,
                filter: 'agDateColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                    comparator: this.getDateFilterComparator
                },
                headerValueGetter: this.localizeHeader.bind(this),
                cellRenderer: (params) => this.dateFormatter(params, 'medium')
            },
            {
                headerName: "SCREEN.modified_by",
                field: "modifiedBy",
                sortable: true,
                editable: false,
                width: 100,
                filter: 'agSetColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this)
            }
        ];

        return staticColumnDef;
    }

    private getStaticPositionColumns() {
        var staticColumnDef = [
            {
                headerName: "FORMS.FIELDS.state",
                field: "status",
                sortable: true,
                editable: false,
                width: 80,
                filter: 'agSetColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                    valueFormatter: (params) => this.statusValueFormatter(params)
                },
                headerValueGetter: this.localizeHeader.bind(this),
                tooltipValueGetter: (params) => params.value,
                cellRenderer: function (params) {

                    if (params.data != null && params.data.status != null) {
                        if (params.data.status == DocumentStatusCodeEnum.active) {
                            return '<center><div class="circle_green" style="margin-top: 8px;" /></center>';
                        }
                        else if (params.data.status == DocumentStatusCodeEnum.canceled) {
                            return '<center><div class="circle_red" style="margin-top: 8px;" /></center>';
                        }
                        else if (params.data.status == DocumentStatusCodeEnum.preparation) {
                            return '<center><div class="circle_orange" style="margin-top: 8px;" /></center>';
                        }
                        else if (params.data.status == DocumentStatusCodeEnum.completed) {
                            return '<center><div class="fas fa-check-circle circle_completed" style="margin-top: 8px;" /></center>';
                        }
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.workOrderOperationCode",
                field: "workOrderOperationCode",
                sortable: true,
                resizable: true,
                width: 150,
                editable: false,
                filter: 'agSetColumnFilter',
                filterParams:
                {
                    buttons: ['reset'],
                    newRowsAction: 'keep'
                },
                headerValueGetter: this.localizeHeader.bind(this),
                valueFormatter: (params) => {
                    return params.data.workOrderOperationCode + "/" + params.data.workOrderOperationPosition;
                },
            },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.product",
                headerValueGetter: this.localizeHeader.bind(this),
                field: "productCode",
                sortable: true,
                editable: false,
                filter: 'agSetColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                width: 150,
                cellRendererParams: {
                    suppressCount: true
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.productName",
                field: "productName",
                sortable: true,
                resizable: true,
                minWidth: 100,
                editable: false,
                filter: 'agSetColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep'
                },
                headerValueGetter: this.localizeHeader.bind(this),
            },
            {
                headerName: "SCREEN.CODETABLE.PRODUCT.productPriceCalculationType",
                field: "productPriceCalculationType",
                width: 150,
                minWidth: 150,
                editable: false,
                filter: true,
                headerValueGetter: this.localizeHeader.bind(this),
                cellEditorFramework: AgGridDialogEditorComponent,
                cellEditorParams: {
                    dialogContext: ProductPriceCalculationTypeDialogComponent,
                    objectName: "productPriceCalculationType",
                    required: true,
                    baseComponentContext: this
                },
                valueFormatter: (params) => {
                    if (params && params.data.productPriceCalculationType) {
                        return this.translateService.instant("SCREEN.CODETABLE.PRODUCT." + params.data.productPriceCalculationType);
                    }
                },
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.position",
                field: "position",
                sortable: true,
                editable: false,
                width: 100,
                filter: 'agNumberColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
                cellRenderer: (params) => {
                    if (params.data && params.data.position == 0) {
                        return "";
                    }
                    else {
                        return params.data.position;
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.quantityOrder",
                field: "quantityOrder",
                sortable: true,
                editable: function (params) {
                    if (params.context.allowedToManipulateUIElements == true) {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                width: 150,
                filter: 'agNumberColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
                cellEditorFramework: AgGridInputCellEditorComponent,
                cellEditorParams: {
                    required: true,
                    //numbersOnly: true
                },
                valueGetter: (params) => {
                    if (!isNaN(params.data.quantityOrder) && params.data.quantityOrder != null) {
                        params.data.quantityOrder = this.numberFormatter(params.data.quantityOrder, params.context.locale);
                        return params.data.quantityOrder;
                    }
                    else {
                        return params.data.quantityOrder;
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.quantityIssued",
                field: "quantityIssued",
                sortable: true,
                editable: false,
                width: 150,
                filter: 'agNumberColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
                valueGetter: (params) => {
                    if (!isNaN(params.data.quantityIssued) && params.data.quantityIssued != null) {
                        params.data.quantityIssued = this.numberFormatter(params.data.quantityIssued, params.context.locale);
                        return params.data.quantityIssued;
                    }
                    else {
                        return params.data.quantityIssued;
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.quantityToIssue",
                field: "quantityToIssue",
                sortable: true,
                editable: false,
                width: 150,
                filter: 'agNumberColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
                valueGetter: (params) => {
                    if (!isNaN(params.data.quantityToIssue) && params.data.quantityToIssue != null) {
                        params.data.quantityToIssue = this.numberFormatter(params.data.quantityToIssue, params.context.locale);
                        return params.data.quantityToIssue;
                    }
                    else {
                        return params.data.quantityToIssue;
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.quantityTakeovered",
                field: "quantityTakeovered",
                sortable: true,
                editable: false,
                width: 150,
                filter: 'agNumberColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
                valueGetter: (params) => {
                    if (!isNaN(params.data.quantityTakeovered) && params.data.quantityTakeovered != null) {
                        params.data.quantityTakeovered = this.numberFormatter(params.data.quantityTakeovered, params.context.locale);
                        return params.data.quantityTakeovered;
                    }
                    else {
                        return params.data.quantityTakeovered;
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.quantityToTakeover",
                field: "quantityToTakeover",
                sortable: true,
                editable: false,
                width: 150,
                filter: 'agNumberColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
                valueGetter: (params) => {
                    if (!isNaN(params.data.quantityToTakeover) && params.data.quantityToTakeover != null) {
                        params.data.quantityToTakeover = this.numberFormatter(params.data.quantityToTakeover, params.context.locale);
                        return params.data.quantityToTakeover;
                    }
                    else {
                        return params.data.quantityToTakeover;
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.unitOfMeasure",
                field: "unitOfMeasureName",
                sortable: true,
                editable: false,
                filter: 'agSetColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this)
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.lastSalesPricePerUnitOfMeasure",
                field: "lastSalesPrice",
                sortable: true,
                editable: false,
                width: 150,
                filter: 'agNumberColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
                valueGetter: (params) => {
                    if (!isNaN(params.data.lastSalesPrice) && params.data.lastSalesPrice != null) {
                        params.data.lastSalesPrice = this.inputDecimalPriceFormatter(this.decimalPipe, params.data.lastSalesPrice, params.context.locale);
                        return params.data.lastSalesPrice;
                    }
                    else {
                        return params.data.lastSalesPrice;
                    }
                }
            },
            {
                headerName: "SCREEN.salesPrice",
                field: "salesPrice",
                sortable: true,
                editable: function (params) {
                    //Only where it's not header
                    if ((params.data && params.data.isHeader) || !params.context.allowedToManipulateUIElements) {
                        return false;
                    }
                    else {
                        return true;
                    }
                },
                width: 150,
                filter: 'agNumberColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
                valueGetter: (params) => {
                    if (!isNaN(params.data.salesPrice) && params.data.salesPrice != null) {
                        params.data.salesPrice = this.numberPriceFormatter(params.data.salesPrice, params.context.locale);
                        return params.data.salesPrice;
                    }
                    else {
                        return params.data.salesPrice;
                    }
                },
                cellEditorFramework: AgGridInputCellEditorComponent,
                cellEditorParams: {
                    required: false,
                    //numbersOnly: true
                },
                suppressKeyboardEvent: (params) => {
                    //Only allow where it's not header
                    if ((params.data && params.data.isHeader) || !params.context.allowedToManipulateUIElements) {
                        return false;
                    }
                    else {
                        this.isAllowedToEnterEditModeWithKeyboardKeys(params);
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.vat",
                field: "valueAddedTaxPercentange",
                width: 80,
                editable: function (params) {
                    //Only where it's not header
                    if ((params.data && params.data.isHeader) || !params.context.allowedToManipulateUIElements) {
                        return false;
                    }
                    else {
                        return true;
                    }
                },
                filter: 'agSetColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                    valueFormatter: (params) => {
                        if (params.value) {
                            return params.context.valueAddedTaxData.filter(c => c.recordId == parseInt(params.value))[0].name;
                        }
                    }
                },
                headerValueGetter: this.localizeHeader.bind(this),
                cellEditorFramework: AgGridDialogEditorComponent,
                cellEditorParams: {
                    dialogContext: ValueAddedTaxComponent,
                    objectName: "valueAddedTax",
                    baseComponentContext: this
                },
                cellRenderer: (params) => {
                    if (params.data && params.data.valueAddedTax) {
                        return params.data.valueAddedTax.percentage + "%";
                    } else if (params.data && params.data.valueAddedTaxPercentange) {
                        return params.data.valueAddedTaxPercentange + "%";
                    }
                },
                getQuickFilterText: function (params) {
                    if (params.data.valueAddedTax) {
                        return params.data.valueAddedTax.percentage + "%";
                    } else if (params.data && params.data.valueAddedTaxPercentange) {
                        return params.data.valueAddedTaxPercentange + "%";
                    }
                },
                suppressKeyboardEvent: (params) => {
                    //Only allow where it's not header
                    if ((params.data && params.data.isHeader) || !params.context.allowedToManipulateUIElements) {
                        return false;
                    }
                    else {
                        this.isAllowedToEnterEditModeWithKeyboardKeys(params);
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.basePrice",
                field: "basePrice",
                sortable: true,
                editable: false,
                width: 150,
                filter: 'agTextColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
                cellRenderer: (params) => this.numberPriceFormatter(params.data.salesPriceCalculatedValue, params.context.locale)
            },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.vatValue",
                field: "valueVAT",
                sortable: true,
                editable: false,
                width: 150,
                filter: 'agNumberColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
                cellRenderer: (params) => this.numberPriceFormatter(params.data.valueAddedTaxCalculatedValue, params.context.locale)
            },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.valueVat",
                field: "valueWithVAT",
                sortable: true,
                editable: false,
                width: 150,
                filter: 'agNumberColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
                cellRenderer: (params) => this.numberPriceFormatter(params.data.valueAddedTaxCalculatedValue + params.data.salesPriceCalculatedValue, params.context.locale)
            },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.discount",
                field: "discount",
                sortable: true,
                editable: function (params) {
                    if (params.data.supplierOrder && (params.data.supplierOrder?.status != DocumentStatusCodeEnum.preparation || params.data.status != DocumentStatusCodeEnum.preparation)) {
                        return false;
                    }
                    else {
                        return true;
                    }
                },
                width: 150,
                filter: 'agNumberColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
                suppressKeyboardEvent: (params) => {
                    if (params.data.supplierOrder && (params.data.supplierOrder?.status != DocumentStatusCodeEnum.preparation || params.data.status != DocumentStatusCodeEnum.preparation)) {
                        return false;
                    }
                    else {
                        this.isAllowedToEnterEditModeWithKeyboardKeys(params);
                    }
                },
                valueFormatter: (params) => {
                    if (params.data && params.data.discount) {
                        var digitalPlaces = 2;
                        var num = params.data.discount;
                        return num.toLocaleString(undefined, { minimumFractionDigits: digitalPlaces, maximumFractionDigits: digitalPlaces });
                    }
                    else {
                        return "0,00";
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.deliveryDate",
                field: "deliveryDate",
                sortable: true,
                editable: function (params) {
                    if (params.data && params.data.status != DocumentStatusCodeEnum.preparation) {
                        return false;
                    }
                    else {
                        return true;
                    }
                },
                filter: 'agDateColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                    comparator: this.getDateFilterComparator,
                    cellRenderer: (params) => this.dateFormatter(params, 'medium'),
                },
                headerValueGetter: this.localizeHeader.bind(this),
                cellRenderer: (params) => this.dateFormatter(params, 'medium'),
                cellEditorFramework: AgGridDateEditorComponent,
                suppressKeyboardEvent: (params) => {
                    if (params.data && params.data.status != DocumentStatusCodeEnum.preparation) {
                        return false;
                    }
                    else {
                        this.isAllowedToEnterEditModeWithKeyboardKeys(params);
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.description",
                field: "description",
                sortable: true,
                editable: function (params) {
                    if (params.data && params.data.status != DocumentStatusCodeEnum.preparation) {
                        return false;
                    }
                    else {
                        return true;
                    }
                },
                filter: 'agTextColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
                suppressKeyboardEvent: (params) => {
                    if (params.data && params.data.status != DocumentStatusCodeEnum.preparation) {
                        return false;
                    }
                    else {
                        this.isAllowedToEnterEditModeWithKeyboardKeys(params);
                    }
                }
            },
            // {
            //     headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.positionAlreadyOrdered",
            //     field: "positionAlreadyOrdered",
            //     sortable: true,
            //     editable: false,
            //     cellStyle: {
            //         textAlign: 'center',
            //     },
            //     width: 140,
            //     minWidth: 130,
            //     filter: 'agSetColumnFilter',
            //     filterParams: {
            //         buttons: ['reset'],
            //         newRowsAction: 'keep',
            //         valueFormatter: this.isActiveFormatter,
            //     },
            //     headerValueGetter: this.localizeHeader.bind(this),
            //     cellRenderer: (params) => {
            //         return this.checkboxSpanValueFormatter(params);
            //     }
            // },
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.createdDate",
                field: "createdDate",
                sortable: true,
                editable: false,
                width: 150,
                filter: 'agDateColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    comparator: this.getDateFilterComparator,
                    cellRenderer: (params) => this.dateFormatter(params, 'medium'),
                },
                headerValueGetter: this.localizeHeader.bind(this),
                cellRenderer: (params) => this.dateFormatter(params, 'medium')
            },
            {
                headerName: "SCREEN.modified_date",
                field: "modifiedDate",
                sortable: true,
                editable: false,
                width: 150,
                filter: 'agDateColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    comparator: this.getDateFilterComparator,
                    cellRenderer: (params) => this.dateFormatter(params, 'medium'),
                },
                headerValueGetter: this.localizeHeader.bind(this),
                cellRenderer: (params) => this.dateFormatter(params, 'medium')
            },
            {
                headerName: "SCREEN.modified_by",
                field: "modifiedBy",
                sortable: true,
                editable: false,
                width: 100,
                filter: 'agSetColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this)
            }
        ];

        return staticColumnDef;
    }

    //Method performs all class forms initialization
    private initializeClassForms() {
        this.cooperationOrderDetailsForm = this.formBuilder.group(
            {
                documentTypeId: [{ value: 49, disabled: false }, Validators.required],
                documentTypeFilter: "",
                typeOfRealisation: [""],
                typeOfRealisationName: ["", Validators.required],
                typeOfRealisationFilter: "",
                supplierName: ["", Validators.required],
                supplier: [],
                supplierFilter: [""],
                project: [""],
                projectName: [""],
                projectFilter: [""],
                paymentTypeName: ["", Validators.required],
                paymentType: [""],
                paymentTypeFilter: [""],
                shippingTypeName: ["", Validators.required],
                shippingType: [""],
                shippingTypeFilter: [""],
                currencyName: ["", Validators.required],
                currency: [""],
                currencyFilter: [""],
                bookedDate: [new Date(), Validators.required],
                reference: [""],
                description: [""],
                discount: [""],
                salesPrice: ["", Validators.required],
                cooperationOrderNumber: [""],
                transportType: [""],
                transportTypeFilter: [""],
                trafficCode: [""],
                workplace: [],
                workplaceId: [""],
                workplaceName: ["", Validators.required],
                valueAddedTax: [],
                valueAddedTaxId: [""],
                valueAddedTaxName: ["", Validators.required],
                priceCalculationType: [],
                priceCalculationTypeId: [""],
                priceCalculationTypeName: [""],
                vatCalculationType: [],
                vatCalculationTypeId: ["", Validators.required],
                vatCalculationTypeName: [""],
            });


        setTimeout(() => {
            this.cooperationOrderDetailsForm.markAllAsTouched();
        }, 10);

        //For date range
        var today = new Date();

        this.cooperationOrdersDateRangeFormGroup = this.formBuilder.group({
            start: new FormControl(new Date(today.setMonth(today.getMonth() - 3))),
            end: new FormControl(new Date())
        });


    }

    //Controls document actions
    private setDocumentActionPermissions() {
        this.saveOrUpdateDisabled = this.isSaveOrUpdateDisabled();
        this.authorizeDisabled = this.isAuthorizeDisabled();
        this.openDisabled = this.isOpenDisabled();
        this.copyDisabled = this.isCopyDisabled();
        this.deleteDisabled = this.isDeleteDisabled();
        this.closeDisabled = this.isCloseDisabled();
        this.reportsDisabled = this.isReportsDisabled();
        this.cancelDisabled = this.isCancelDisabled();
        this.showVAT = this.canShowVAT();

        this.allowedToManipulateUIElements = this.allowedToManipulateUI();
        this.allowedToChangeDocumentType = this.allowedToChangeDocumentTypeUI();
    }

    //Controls if SaveOrUpdate document action is allowed
    private isSaveOrUpdateDisabled() {
        var retVal: boolean = true;

        //1. First we check the permissions
        if (this.hasReadWritePermissions) {
            //2. Check the document status
            if (this.selectedCooperationOrderData.status === DocumentStatusCodeEnum.preparation) {
                retVal = false;
            }
        }

        return retVal;
    }

    //Controls if Authorize document action is allowed
    private isAuthorizeDisabled() {
        var retVal: boolean = true;

        //1. First we check the permissions
        if (this.hasReadWritePermissions && this.checkExtraPermission('purchaseCooperationOrder', AccessTypeEnum.readWrite, 'purchaseCooperationOrderManagement')) {
            //2. Check the document status
            if (this.selectedCooperationOrderData.status === DocumentStatusCodeEnum.preparation && this.selectedCooperationOrderData.recordId !== 0) {
                retVal = false;
            }
        }

        return retVal;

    }

    //Controls if Open document action is allowed
    private isOpenDisabled() {
        var retVal: boolean = true;

        //1. First we check the permissions
        if (this.hasReadWritePermissions) {
            //2. Check the document status
            if (this.selectedCooperationOrderData.status === DocumentStatusCodeEnum.completed || this.selectedCooperationOrderData.status === DocumentStatusCodeEnum.active) {
                //3. Check that cooperation order already have record ID
                if (this.selectedCooperationOrderData?.recordId !== 0) {
                    retVal = false;
                }
            }
        }

        return retVal;
    }

    //Controls if export PDF document action is allowed
    private isReportsDisabled() {
        var retVal: boolean = true;

        //1. First we check the permissions
        if (this.hasReadPermissions) {
            //2. Check the document status
            if (this.selectedCooperationOrderData.recordId !== 0) {
                retVal = false;
            }
        }

        return retVal;

    }

    //Controls if Copy document action is allowed
    private isCopyDisabled() {
        var retVal: boolean = true;

        //1. First we check the permissions
        if (this.hasReadWritePermissions) {
            //2. Check the document status
            if (this.selectedCooperationOrderData?.recordId !== 0) {
                retVal = false;
            }
        }

        return retVal;
    }

    //Controls if Delete document action is allowed
    private isDeleteDisabled() {
        var retVal: boolean = true;

        //1. First we check the permissions
        if (this.hasReadWritePermissions) {
            //2. Check the document status
            if (this.selectedCooperationOrderData?.status === DocumentStatusCodeEnum.preparation && this.selectedCooperationOrderData?.recordId !== 0) {
                retVal = false;
            }
        }

        return retVal;
    }

    private canShowVAT() {
        var retVal: boolean = false;

        if (this.selectedCooperationOrderData?.vatCalculationType) {
            if (this.selectedCooperationOrderData.vatCalculationType.code == VATCalculationTypeStringsEnum.calc1 || this.selectedCooperationOrderData.vatCalculationType.code == VATCalculationTypeStringsEnum.calc2) {
                retVal = true;
            }
        } else if (this.selectedCooperationOrderData?.vatCalculationTypeCode) {
            if (this.selectedCooperationOrderData.vatCalculationTypeCode == VATCalculationTypeStringsEnum.calc1 || this.selectedCooperationOrderData.vatCalculationTypeCode == VATCalculationTypeStringsEnum.calc2) {
                retVal = true;
            }
        }

        return retVal;
    }

    //Controls if Close document action is allowed
    private isCloseDisabled() {
        var retVal: boolean = true;

        //1. First we check the permissions
        if (this.hasReadWritePermissions) {
            //2. Check the document status
            if (this.selectedCooperationOrderData?.status === DocumentStatusCodeEnum.active) {

                if (this.selectedCooperationOrderData?.recordId !== 0) {
                    retVal = false;
                }
            }
        }

        return retVal;
    }

    //Controls if Cancel document action is allowed
    private isCancelDisabled() {
        var retVal: boolean = true;

        //? Canceling cooperation order is currently disabled, but leave this here if you need it future

        // //1. First we check the permissions
        // if (this.hasReadWritePermissions && this.checkExtraPermission('salesCustomerOrder', AccessTypeEnum.readWrite, 'salesCustomerOrderCancelManagement')) {
        //     //2. Check the document status
        //     if (this.selectedCooperationOrderData?.status === DocumentStatusCodeEnum.active ||
        //         this.selectedCooperationOrderData?.status === DocumentStatusCodeEnum.completed) {

        //         if (this.selectedCooperationOrderData?.recordId !== 0) {
        //             retVal = false;
        //         }
        //     }
        // }

        return retVal;
    }

    //Controls if user is allowed to manipulate UI elements
    private allowedToManipulateUI() {
        var retVal = false;

        if (this.selectedCooperationOrderData.status) {
            switch (this.selectedCooperationOrderData.status) {
                case DocumentStatusCodeEnum.active:
                case DocumentStatusCodeEnum.canceled:
                case DocumentStatusCodeEnum.completed:
                    retVal = false;
                    break;
                case DocumentStatusCodeEnum.preparation:
                    retVal = true;
                    break
            }
        }
        else {
            retVal = true;
        }

        return retVal;
    }

    //Sets and manipulates values of cooperationOrderDetailsForm
    private setCooperationOrderDetailsFormData() {

        //manipulate document type dropdown
        var documentTypeId = this.selectedCooperationOrderData.documentTypeId;
        var documentTypeSelect = {};

        if (this.allowedToChangeDocumentType) {
            documentTypeSelect = {
                value: documentTypeId,
                disabled: false
            }
        }
        else {
            documentTypeSelect = {
                value: documentTypeId,
                disabled: true
            }
        }

        if (!this.selectedCooperationOrderData.salesPrice) {
            this.selectedCooperationOrderData.salesPrice = 0;
        }
        if (!this.selectedCooperationOrderData.discount) {
            this.selectedCooperationOrderData.discount = 0;
        }

        //setting values in form
        this.cooperationOrderDetailsForm.controls["documentTypeId"].reset(documentTypeSelect);
        this.cooperationOrderDetailsForm.controls["documentTypeId"].updateValueAndValidity();
        this.cooperationOrderDetailsForm.controls["typeOfRealisationName"].setValue(this.selectedCooperationOrderData.typeOfRealisationName);
        this.cooperationOrderDetailsForm.controls["typeOfRealisationName"].updateValueAndValidity();
        this.cooperationOrderDetailsForm.controls["projectName"].setValue(this.selectedCooperationOrderData.projectName);
        this.cooperationOrderDetailsForm.controls["projectName"].updateValueAndValidity();
        this.cooperationOrderDetailsForm.controls["workplaceName"].setValue(this.selectedCooperationOrderData.workplaceName);
        this.cooperationOrderDetailsForm.controls["workplaceName"].updateValueAndValidity();
        this.cooperationOrderDetailsForm.controls["supplierName"].setValue(this.selectedCooperationOrderData.supplierName);
        this.cooperationOrderDetailsForm.controls["supplierName"].updateValueAndValidity();
        this.cooperationOrderDetailsForm.controls["shippingTypeName"].setValue(this.selectedCooperationOrderData.shippingTypeName);
        this.cooperationOrderDetailsForm.controls["shippingTypeName"].updateValueAndValidity();
        this.cooperationOrderDetailsForm.controls["salesPrice"].setValue(this.numberFormatter(this.selectedCooperationOrderData.salesPrice, this.locale));
        this.cooperationOrderDetailsForm.controls["salesPrice"].updateValueAndValidity();
        this.cooperationOrderDetailsForm.controls["currencyName"].setValue(this.selectedCooperationOrderData.currencyName);
        this.cooperationOrderDetailsForm.controls["currencyName"].updateValueAndValidity();
        this.cooperationOrderDetailsForm.controls["valueAddedTaxName"].setValue(this.selectedCooperationOrderData.valueAddedTaxName);
        this.cooperationOrderDetailsForm.controls["valueAddedTaxName"].updateValueAndValidity();
        this.cooperationOrderDetailsForm.controls["discount"].setValue(this.numberFormatter(this.selectedCooperationOrderData.discount, this.locale));
        this.cooperationOrderDetailsForm.controls["discount"].updateValueAndValidity();
        this.cooperationOrderDetailsForm.controls["paymentTypeName"].setValue(this.selectedCooperationOrderData.paymentTypeName);
        this.cooperationOrderDetailsForm.controls["paymentTypeName"].updateValueAndValidity();
        this.cooperationOrderDetailsForm.controls["bookedDate"].setValue(this.selectedCooperationOrderData.bookedDate);
        this.cooperationOrderDetailsForm.controls["bookedDate"].updateValueAndValidity();
        this.cooperationOrderDetailsForm.controls["cooperationOrderNumber"].setValue(this.selectedCooperationOrderData.cooperationOrderNumber);
        this.cooperationOrderDetailsForm.controls["cooperationOrderNumber"].updateValueAndValidity();
        this.cooperationOrderDetailsForm.controls["description"].setValue(this.selectedCooperationOrderData.description);
        this.cooperationOrderDetailsForm.controls["description"].updateValueAndValidity();


        this.cooperationOrderDetailsForm.controls.priceCalculationType.setValue(null);
        var calculationTypes = this.staticProductPriceCalculationTypeData.getProductPriceCalculationTypeData();

        this.cooperationOrderDetailsForm.controls["vatCalculationType"].setValue(null);
        this.cooperationOrderDetailsForm.controls["vatCalculationType"].updateValueAndValidity();
        this.cooperationOrderDetailsForm.controls["vatCalculationTypeId"].setValue(null);
        this.cooperationOrderDetailsForm.controls["vatCalculationTypeId"].updateValueAndValidity();
        this.cooperationOrderDetailsForm.controls["vatCalculationTypeName"].setValue(null);
        this.cooperationOrderDetailsForm.controls["vatCalculationTypeName"].updateValueAndValidity();
        if (this.selectedCooperationOrderData && this.selectedCooperationOrderData.vatCalculationTypeId) {
            if (this.selectedCooperationOrderData.vatCalculationType) {
                this.cooperationOrderDetailsForm.controls["vatCalculationType"].setValue(this.selectedCooperationOrderData.vatCalculationType);
                this.cooperationOrderDetailsForm.controls["vatCalculationType"].updateValueAndValidity();
                this.cooperationOrderDetailsForm.controls["vatCalculationTypeId"].setValue(this.selectedCooperationOrderData.vatCalculationType.recordId);
                this.cooperationOrderDetailsForm.controls["vatCalculationTypeId"].updateValueAndValidity();
                this.cooperationOrderDetailsForm.controls["vatCalculationTypeName"].setValue(this.selectedCooperationOrderData.vatCalculationType.name);
                this.cooperationOrderDetailsForm.controls["vatCalculationTypeName"].updateValueAndValidity();
            }
        }

        if (this.selectedCooperationOrderData && this.selectedCooperationOrderData.priceCalculationType) {
            var calculationType = calculationTypes.filter(el => el.type == this.selectedCooperationOrderData.priceCalculationType.toString())[0];

            if (calculationType) {
                this.cooperationOrderDetailsForm.controls["priceCalculationType"].setValue(calculationType);
                this.cooperationOrderDetailsForm.controls["priceCalculationType"].updateValueAndValidity();

                this.cooperationOrderDetailsForm.controls["priceCalculationTypeName"].setValue(calculationType.name);
                this.cooperationOrderDetailsForm.controls["priceCalculationTypeName"].updateValueAndValidity();
            }
        }

        if (this.selectedCooperationOrderData.recordId != 0) {
            this.refreshSummaryTable();
        }
        else {
            this.chosenCoopeartionOrderSummaryData = {
                totalPriceExcludingVat: 0,
                //vat: 0,
                totalPriceIncludingVat: 0
            };
        }
    }

    //API - get summary table for cooperation order
    private refreshSummaryTable() {
        var getRequest: GetCooperationOrderCalculationsRequest = new GetCooperationOrderCalculationsRequest();
        getRequest.cooperationOrderId = this.selectedCooperationOrderData.recordId;
        this.documentBusy.busy.push(this.salesService.getCooperationOrderCalculations(getRequest).subscribe(
            (success) => {
                let sumBasePrice: number = 0;
                success.cooperationOrderPositionVATCalculations.forEach(position => {
                    let element = position.vatCalculationElements.filter(x => x.code == VATCalculationElementTypeStringsEnum.BP)[0];
                    if (element) {
                        sumBasePrice += element.calculatedValue;
                    }
                });

                let sumPositionDiscountValue: number = 0;
                success.cooperationOrderPositionVATCalculations.forEach(position => {
                    let element = position.vatCalculationElements.filter(x => x.code == VATCalculationElementTypeStringsEnum.P3)[0];
                    if (element) {
                        sumPositionDiscountValue += element.calculatedValue;
                    }
                });

                let sumDiscountValue: number = 0;
                success.cooperationOrderPositionVATCalculations.forEach(position => {
                    let element = position.vatCalculationElements.filter(x => x.code == VATCalculationElementTypeStringsEnum.P1)[0];
                    if (element) {
                        sumDiscountValue += element.calculatedValue;
                    }
                });

                let sumVATBase: number = 0;
                success.cooperationOrderPositionVATCalculations.forEach(position => {
                    let element = position.vatCalculationElements.filter(x => x.code == VATCalculationElementTypeStringsEnum.Z1)[0];
                    if (element) {
                        sumVATBase += element.calculatedValue;
                    }
                });

                let sumVATValue: number = 0;
                success.cooperationOrderPositionVATCalculations.forEach(position => {
                    let element = position.vatCalculationElements.filter(x => x.code == VATCalculationElementTypeStringsEnum.DZ)[0];
                    if (element) {
                        sumVATValue += element.calculatedValue;
                    }
                });

                let sumNetWorth: number = 0;
                success.cooperationOrderPositionVATCalculations.forEach(position => {
                    let element = position.vatCalculationElements.filter(x => x.code == VATCalculationElementTypeStringsEnum.NP)[0];
                    if (element) {
                        sumNetWorth += element.calculatedValue;
                    }
                });

                this.cooperationOrderCalculations.basePrice = sumBasePrice;
                this.cooperationOrderCalculations.discountValue = sumPositionDiscountValue + sumDiscountValue;
                this.cooperationOrderCalculations.VATBase = sumVATBase;
                this.cooperationOrderCalculations.VATValue = sumVATValue;
                this.cooperationOrderCalculations.netWorth = sumNetWorth;
            },
            (exception) => {
                var errorCode: ResultCodeEnum = exception.error.resultCode;
                var resultCode = "RESULT_CODES." + ResultCodeEnum[errorCode];

                this.translateService.get(["RESULT_CODES.error_title", resultCode]).subscribe(
                    (tResult: string) => {
                        Swal.fire(tResult["RESULT_CODES.error_title"], tResult[resultCode], 'error');
                    }
                )
            }
        ))
    }

    //API - method loads positions from the server
    private getPositions(documentHeadRecordId: number) {
        var getCooperationOrderPositionRequest = new GetCooperationOrderPositionRequest()
        getCooperationOrderPositionRequest.cooperationOrderId = documentHeadRecordId;
        var observableBatch = [];
        observableBatch.push();

        this.documentBusy.busy.push(forkJoin({
            cooperationOrderPositions: this.procurementService.getCooperationOrderPositions(getCooperationOrderPositionRequest)
        }).subscribe(({ cooperationOrderPositions }) => {
            this.cooperationOrderPositionData = cooperationOrderPositions.data;
            var columnDef: any = this.getStaticPositionColumns();

            //Related to: https://github.com/ag-grid/ag-grid/issues/2889
            this.cooperationOrderPositionGrid.api.setColumnDefs([]);
            this.cooperationOrderPositionGrid.api.setColumnDefs(columnDef);

            var cooperationForAllPositionsComplete: boolean = true;
            this.cooperationOrderPositionData.forEach(position => {
                if (position.quantityOrder != position.quantityIssued || position.quantityOrder != position.quantityTakeovered) {
                    cooperationForAllPositionsComplete = false;
                }
            });

            setTimeout(() => {
                this.isCooperationForAllPositionsComplete = true;
                if (this.cooperationOrderPositionData.length == 0 || !cooperationForAllPositionsComplete) {
                    this.isCooperationForAllPositionsComplete = false;
                }
            }, 100)


        }));
    }

    //API - recaluclates order price based on positions and cooperation price list
    private calculateOrderValue(positions) {
        var retVal = 0;
        positions.forEach(position => {
            if (position.product.productPriceCalculationType == ProductPriceCalculationTypeStringsEnum.calculateByPiece) {
                retVal += position.quantity * position.salesPrice;
            }
            else if (position.product.productPriceCalculationType == ProductPriceCalculationTypeStringsEnum.calculateByArea) {
                var width = 1;
                var length = 1;
                if (position.product.width) {
                    width = position.product.width;
                }
                if (position.product.length) {
                    length = position.product.length;
                }
                var area = width * length;
                retVal += area * position.quantity * position.salesPrice;
            }
        });
        return retVal.toLocaleString(undefined, { minimumFractionDigits: 2 });;
    }

    private generatePdfReportCooperationOrder(cooperationOrderData: CooperationOrderData) {

        var language = this.locale;
        var observableBatch: any = {};

        var getCooperationOrderPositionRequest: GetCooperationOrderPositionRequest = new GetCooperationOrderPositionRequest();
        getCooperationOrderPositionRequest.cooperationOrderId = cooperationOrderData.recordId;

        var getCooperantRequest: GetSupplierRequest = new GetSupplierRequest;
        getCooperantRequest.recordId = cooperationOrderData.supplierId;

        var getCooperationOrderRequest: GetCooperationOrderReportRequest = new GetCooperationOrderReportRequest();
        getCooperationOrderRequest.recordId = cooperationOrderData.recordId;

        var getCooperationOrderCalculationsRequest: GetCooperationOrderCalculationsRequest = new GetCooperationOrderCalculationsRequest();
        getCooperationOrderCalculationsRequest.cooperationOrderId = this.selectedCooperationOrderData.recordId;

        var getDocumentTypeCalculationTypeClausesRequest: GetDocumentTypeCalculationTypeClausesRequest = new GetDocumentTypeCalculationTypeClausesRequest;

        let clauseReq = null;
        if (cooperationOrderData.vatCalculationTypeId) {
            getDocumentTypeCalculationTypeClausesRequest.documentTypeId = cooperationOrderData.documentTypeId;
            getDocumentTypeCalculationTypeClausesRequest.vatCalculationTypeId = cooperationOrderData.vatCalculationTypeId;
            getDocumentTypeCalculationTypeClausesRequest.addTranslations = true;
            clauseReq = this.codeTableService.getDocumentTypeCalculationTypeClauses(getDocumentTypeCalculationTypeClausesRequest);
        }
        else {
            clauseReq = of(null);
        }

        this.documentBusy.busy.push(forkJoin({
            companies: this.codeTableService.getCompanies(new GetCompanyRequest()),
            cooperationOrderPositions: this.procurementService.getCooperationOrderPositions(getCooperationOrderPositionRequest),
            cooperationOrderReport: this.procurementService.getCooperationOrderReport(getCooperationOrderRequest),
            cooperants: this.codeTableService.getSuppliers(getCooperantRequest),
            onlineUser: this.codeTableService.getEmployeeOnlineUser(new GetEmployeeOnlineUserRequest()),
            calculations: this.salesService.getCooperationOrderCalculations(getCooperationOrderCalculationsRequest),
            clauses: clauseReq
        }).subscribe(({ companies, cooperationOrderPositions, cooperationOrderReport, cooperants, onlineUser, calculations, clauses }) => {
            var companyData;
            var orderPositions = cooperationOrderPositions.data;
            var cooperantData;
            var onlineUserData: EmployeeData;
            var cooperationOrderReportData = cooperationOrderReport;

            if (companies.data.length >= 1) {
                companyData = companies.data[0];
            }

            cooperationOrderReportData.cooperationOrderDisclaimerText = companyData.extraLine[2];

            if (cooperants.data.length >= 1) {
                cooperantData = cooperants.data[0];
                if (cooperantData.addresses.length >= 1) {
                    cooperantData["defaultAddress"] = cooperantData.addresses[0];
                }
            }

            if (onlineUser.count >= 1) {
                onlineUserData = onlineUser.data[0];
            }

            var calculationsData = {
                salesPrice: 0,
                discountValue: 0,
                VATBase: 0,
                VATValue: 0,
                finalPrice: 0,
                clause: "",
                showVAT: this.showVAT
            }

            if (calculations != null) {
                calculations.cooperationOrderPositionVATCalculations.forEach(x => {
                    calculationsData.salesPrice += x.vatCalculationElements.find(y => y.code == VATCalculationElementTypeStringsEnum.BP)?.calculatedValue;
                    calculationsData.discountValue += x.vatCalculationElements.find(y => y.code == VATCalculationElementTypeStringsEnum.P1)?.calculatedValue + x.vatCalculationElements.find(y => y.code == VATCalculationElementTypeStringsEnum.P3)?.calculatedValue;
                    calculationsData.VATBase += x.vatCalculationElements.find(y => y.code == VATCalculationElementTypeStringsEnum.Z1)?.calculatedValue;
                    calculationsData.VATValue += x.vatCalculationElements.find(y => y.code == VATCalculationElementTypeStringsEnum.DZ)?.calculatedValue;
                    calculationsData.finalPrice += x.vatCalculationElements.find(y => y.code == VATCalculationElementTypeStringsEnum.NP)?.calculatedValue;
                })
            }

            if (clauses != null) {
                if (clauses["count"] >= 1) {
                    calculationsData.clause = clauses["data"][0].languageResource?.languageResourceTranslations?.find(x => x.language == this.locale)?.translationValue;
                }
            }

            //Generate report data
            var template: JsReportTemplateData = new JsReportTemplateData();
            template.name = "/procurement/cooperationOrder/index";
            template.recipe = "chrome-pdf";

            var reportData = new JsReportBaseData();
            reportData.companyData = companyData;
            reportData.environment = environment.baseUrl;
            reportData.isTestEnvironment = this.convertToBoolean(environment.JSREPORT.isTestEnvironment);
            reportData["cooperationOrderData"] = cooperationOrderReportData;
            reportData["cooperantData"] = cooperantData;
            reportData["orderPositions"] = orderPositions;
            reportData["onlineUserData"] = onlineUserData;
            reportData["calculations"] = calculationsData;

            var jsReportRequest = new JsReportManufacturingRequest(template, reportData, this.translationFactory, this.authRepository.getOnlineUser().preferredDecimalPlaces);

            this.documentBusy.busy.push(this.jsReportService.getReport(jsReportRequest).subscribe(
                (data) => {
                    this.jsReportService.openReport(this.translateService.instant('SCREEN.PROCUREMENT.COOPERATIONORDERS.reportName'), data);
                }
            ))
        }));
    }

    private onShowActiveCooperationPositionsDialog() {
        var dataObject = {

        };

        let dialogRef = this.dialog.open(CooperationOrderActivePositionsDialogComponent, {
            height: '90%',
            width: '90%',
            panelClass: 'code-table-dialog',
            data: dataObject,
            disableClose: false
        });

        dialogRef.afterClosed().subscribe((result) => {
            //Don't need to do anything
        });
    }

    private onShowCooperationOrderPositionsDialog() {
        var dataObject = {

        };

        let dialogRef = this.dialog.open(CooperationOrderPositionPricesDialogComponent, {
            height: '90%',
            width: '90%',
            panelClass: 'code-table-dialog',
            data: dataObject,
            disableClose: false
        });

        dialogRef.afterClosed().subscribe((result) => {
            //Don't need to do anything
        });
    }
}



