import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { RowNode, GridOptions, GridApi } from 'ag-grid-community';
import { Subscription, forkJoin, of } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../../../environments/environment';
import { AuthenticationRepository } from '../../../../Truster.Core.UI.Authentication/repositories/authentication.repository';
import { GetCompanyRequest } from '../../../../Truster.Core.UI.CodeTable/commands/requests/get.company.request';
import { GetSupplierRequest } from '../../../../Truster.Core.UI.CodeTable/commands/requests/get.supplier.request';
import { ColumnData } from '../../../../Truster.Core.UI.CodeTable/helpers/column-data';
import { CompanyData } from '../../../../Truster.Core.UI.CodeTable/helpers/company-data';
import { CurrencyData } from '../../../../Truster.Core.UI.CodeTable/helpers/currency-data';
import { DocumentStatusCodeEnum } from '../../../../Truster.Core.UI.CodeTable/helpers/document-status-code-enum';
import { DocumentTypeData } from '../../../../Truster.Core.UI.CodeTable/helpers/document-type-data';
import { LocalStorageConfig } from '../../../../Truster.Core.UI.CodeTable/helpers/localStorageConfig';
import { PaymentTypeData } from '../../../../Truster.Core.UI.CodeTable/helpers/payment-type-data';
import { ProductData } from '../../../../Truster.Core.UI.CodeTable/helpers/product-data';
import { ProjectData } from '../../../../Truster.Core.UI.CodeTable/helpers/project-data';
import { ShippingTypeData } from '../../../../Truster.Core.UI.CodeTable/helpers/shipping-type-data';
import { SupplierData } from '../../../../Truster.Core.UI.CodeTable/helpers/supplier-data';
import { TypeOfRealisationData } from '../../../../Truster.Core.UI.CodeTable/helpers/typeofrealisation-data';
import { ValueAddedTaxData } from '../../../../Truster.Core.UI.CodeTable/helpers/value-added-tax-data';
import { CodeTableService } from '../../../../Truster.Core.UI.CodeTable/services/code-table.service';
import { ManufacturingService } from '../../../../Truster.Core.UI.Manufacturing/services/manufacturing.service';
import { ScreensFactory } from '../../../../Truster.Core.UI.Permission/factories/screens.factory';
import { ScreenTypeFactoryEnum } from '../../../../Truster.Core.UI.Permission/helpers/screen.type.factory.enum';
import { PermissionRepository } from '../../../../Truster.Core.UI.Permission/repositories/permission.repository';
import { AgGridBaseComponent } from '../../../../Truster.Core.UI.SharedUIComponents/ag-grid/ag-grid-base/ag-grid-base.component';
import { AgGridInputCellEditorComponent } from '../../../../Truster.Core.UI.SharedUIComponents/ag-grid/editors/ag-grid-input-cell-editor/ag-grid-input-cell-editor.component';
import { JsReportManufacturingRequest } from '../../../../Truster.Core.UI.SharedUIComponents/commands/jsreportmanufacturing.request';
import { ConfirmationDialogComponent } from '../../../../Truster.Core.UI.SharedUIComponents/dialogs/confirmation-dialog/confirmation-dialog.component';
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
import { GetCooperationOrderRequest } from '../../../commands/requests/get.cooperation.order.request';
import { CooperationOrderData } from '../../../helpers/cooperation-order-data';
import { CooperationOrderSummaryData } from '../../../helpers/cooperation-order-summary-data';
import { SupplierOrderPositionData } from '../../../helpers/supplier-order-position-data';
import { ProcurementService } from '../../../services/procurement.service';
import { GetCooperationOrderTakeoverPositionRequest } from '../../../commands/requests/get.cooperation.order.takeover.position.request';
import { CooperationOrderTakeoverPositionData } from '../../../helpers/cooperation-order-takeover-position-data';
import { GetProductConversionQuantityRequest } from '../../../../Truster.Core.UI.CodeTable/commands/requests/get.product.conversion.quantity.request';
import { PostCooperationOrderTakeoverConfirmRequest } from '../../../commands/requests/post.cooperation.order.takeover.confirm.request';
import { GetCooperationTakeoverRequest } from '../../../commands/requests/get.cooperation.takeover.request';
import { CooperationOrderTakeoverPositionRequestData } from '../../../helpers/cooperation-order-takeover-position-request-data';
import { CooperationTakeoverData } from '../../../helpers/cooperation-takeover-data';
import { CooperationTakeoverPositionsDialogComponent } from './cooperation-takeover-positions-dialog/cooperation-takeover-positions-dialog.component';
import { GetCooperationTakeoverPositionRequest } from '../../../commands/requests/get.cooperation.takeover.position.request';
import { CooperationOrderStatusEnum } from '../../../helpers/cooperation-order-status-enum';
import { CooperationOrderStatusEnumStrings } from '../../../helpers/cooperation-order-status-enum-strings';
import { GetEmployeeOnlineUserRequest } from '../../../../Truster.Core.UI.CodeTable/commands/requests/get.employee.onlineuser.request';
import { EmployeeData } from '../../../../Truster.Core.UI.CodeTable/helpers/employee-data';
import { IBusyConfig } from 'ng-busy';
import { BusyConfigFactory } from '../../../../Truster.Core.UI.SharedUIComponents/loading-spinner/busy.config.factory';
import { Router, ActivatedRoute } from '@angular/router';
import { PostCooperationOrderTakeoverCancelRequest } from '../../../commands/requests/post.cooperation.order.takeover.cancel.request';

@Component({
    selector: 'app-cooperation-takeover',
    templateUrl: './cooperation-takeover.component.html',
    styleUrls: ['./cooperation-takeover.component.scss']
})

export class CooperationTakeoverComponent extends AgGridBaseComponent implements OnInit, OnDestroy {
    //Ag grid ViewChilds
    @ViewChild('cooperationOrderGrid', { static: true }) cooperationOrderGrid: AgGridAngular;

    private cooperationOrderTakeoverPositionGrid: AgGridAngular;
    @ViewChild('cooperationOrderTakeoverPositionGrid', { static: false }) set coopOrderTakeoverPosGrid(component: AgGridAngular) {
        if (component) {
            this.cooperationOrderTakeoverPositionGrid = component;
        }
    };

    private cooperationTakeoverGrid: AgGridAngular;
    @ViewChild('cooperationTakeoverGrid', { static: false }) set coopOrderTakeoverGrid(component: AgGridAngular) {
        if (component) {
            this.cooperationTakeoverGrid = component;
        }
    };

    @ViewChild('searchInput', { static: true }) searchInput: ElementRef;


    //Ag grid related properties
    chosenCooperationOrderNode: RowNode;
    chosenCooperationOrderPositionNode: RowNode;

    cooperationTakeoversGridOptions: GridOptions = {
        localeText: this._localeText,
        animateRows: false,
        defaultColDef: {
            width: 200,
            editable: false,
            resizable: true,
            sortable: true
        },
        rowSelection: "single",
        editType: "fullRow",
        accentedSort: true,
        suppressColumnVirtualisation: true,
        suppressClipboardPaste: true,
        suppressCopyRowsToClipboard: true,

        tabToNextCell: this.tabToNextCell.bind(this),
        onSortChanged: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onSelectionChanged: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onFilterChanged: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onColumnResized: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onColumnMoved: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onColumnPinned: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onColumnVisible: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onRowEditingStarted: (event) => {
            var rowNode: RowNode = event.node;
            this.focusLastEditableCell(this.cooperationOrderGrid, rowNode);
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

    cooperationOrderTakeoverPositionsGridOptions: GridOptions = {
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
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onSelectionChanged: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onFilterChanged: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onColumnResized: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onColumnMoved: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onColumnPinned: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onColumnVisible: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onRowEditingStarted: (event) => {
            var rowNode: RowNode = event.node;
            this.focusLastEditableCell(this.cooperationOrderTakeoverPositionGrid, rowNode);
        },
        onRowClicked: (event) => {
            //console.log(event.data);
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

    cooperationTakeoverGridOptions: GridOptions = {
        localeText: this._localeText,
        animateRows: false,
        defaultColDef: {
            width: 200,
            editable: false,
            resizable: true,
            sortable: true
        },
        rowSelection: "single",
        editType: "fullRow",
        accentedSort: true,
        suppressColumnVirtualisation: true,
        suppressClipboardPaste: true,
        suppressCopyRowsToClipboard: true,

        tabToNextCell: this.tabToNextCell.bind(this),
        onSortChanged: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onSelectionChanged: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onFilterChanged: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onColumnResized: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onColumnMoved: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onColumnPinned: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onColumnVisible: (event) => {
            this.onAgGridEvent(ScreenTypeFactoryEnum.cooperationTakeoversScreen, event);
        },
        onRowEditingStarted: (event) => {
            var rowNode: RowNode = event.node;
            this.focusLastEditableCell(this.cooperationTakeoverGrid, rowNode);
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
    loadingBusy: IBusyConfig = BusyConfigFactory.create();
    cooperationTakeoverGridBusy: IBusyConfig = BusyConfigFactory.create();

    //Form related properties
    cooperationOrderDetailsForm: FormGroup;
    cooperationOrdersDateRangeFormGroup: FormGroup;

    //Object data related properties
    cooperationOrdersData: CooperationOrderData[] = [];
    cooperationOrderTakeoverPositionData: CooperationOrderTakeoverPositionData[] = [];
    cooperationTakeoverData: CooperationTakeoverData[] = [];


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
    companyData: CompanyData[] = [];
    documentTypes = [];
    costCenters = [];
    paymentTypes = [];
    currencies = [];
    transportTypes = [];
    extraColumnsData: ColumnData[] = [];

    // Local storage variables
    config: LocalStorageConfig = null;
    areaSplitWindowWidths: number[];
    areaSplitWindowNumber: number;

    restrictMove: boolean = false;
    showAddPosition: boolean = false;

    locale;
    statusData = this.enumToArray(CooperationOrderStatusEnum);
    selectedStatus: CooperationOrderStatusEnum = CooperationOrderStatusEnum.active;
    CooperationOrderStatusEnumStrings = CooperationOrderStatusEnumStrings;

    //Document actions
    saveOrUpdateDisabled = true;
    authorizeDisabled = true;

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
        public screenTypeService: ScreenTypeService,
        public permissionTypeService: PermissionTypeService,
        public translateService: TranslateService,
        private changeDetector: ChangeDetectorRef,
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
        if (this.loadingBusy) {
            this.loadingBusy.busy.forEach((busyElement: Subscription) => {
                busyElement.unsubscribe();
            })
        }
    }

    ngOnInit(): void {
        //1. Check UI permissions
        this.checkUIPermissions("purchaseCooperationTakeover", "purchaseCooperationIssueAndTakeoverManagement");
        this.setDocumentActionPermissions();

        //2. Set local storage stuff - function sets split area widths from local storage.
        this.setSplitAreas(ScreenTypeFactoryEnum.cooperationTakeoversScreen);

        //3. Initialize Forms
        this.initializeClassForms();

        //4. Remove deleted status from drowpdown
        this.statusData = this.statusData.filter(x =>
            x.name != CooperationOrderStatusEnumStrings.preparation);

        //5. Subscribe to route params change and load data
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
                    setTimeout(() => {
                        this.headTabVisible = true;
                        this.positionsTabVisible = true;
                        this.currentTabIndex = 1; //select header tab
                    }, 20)
                }
                else {
                    this.headTabVisible = false;
                    this.positionsTabVisible = false;

                    //Important
                    //We need to manualy clear the ag-grid reference, 
                    //because on back browser button angular is not destroying it from memory 
                    this.cooperationOrderTakeoverPositionGrid = undefined;
                    this.cooperationTakeoverGrid = undefined;

                    //Reinitialize variables
                    this.selectedCooperationOrderData = {};
                }

                //Loads overview tab with query params
                this.getScreenData(cooperationOrderId, this.selectedStatus, dateFrom, dateTo);
            }
        })

        //6. Navigate to load data
        this.router.navigate(['procurement/cooperation/takeovers',
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
            this.router.navigate(['procurement/cooperation/takeovers',
                {
                    ofRowId: this.selectedCooperationOrderData.recordId,
                    ofStatus: this.selectedStatus,
                    ofDateFrom: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("start").value.toISOString()),
                    ofDateTo: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("end").value.toISOString())
                }]);
        }
    }

    onStatusChanged(params) {

        this.router.navigate(['procurement/cooperation/takeovers',
            {
                ofStatus: this.selectedStatus,
                ofDateFrom: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("start").value.toISOString()),
                ofDateTo: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("end").value.toISOString())
            }]);
    }

    //Single click row on supplier orders - we enable buttons only
    onCooperationOrderDetailsRowClicked(params) {
        this.setDocumentActionPermissions();
    }

    //Opens supplier order details (DocumentHead) (double click row)
    onCooperationOrderDetails(params) {
        var rowNode: RowNode = params.node;
        this.handleEmptyGridColumns(1, rowNode);
        if (params.data.recordId == 0 && this.selectedCooperationOrderData.recordId == 0) {
            return;
        }

        //assign the new object value
        this.selectedCooperationOrderData = Object.assign({}, params.data);

        //reset document action permissions
        this.setDocumentActionPermissions();

        //manipulate head and position documents
        this.chosenCooperationOrderNode = params.node;

        this.router.navigate(['procurement/cooperation/takeovers',
            {
                ofRowId: this.selectedCooperationOrderData.recordId,
                ofStatus: this.selectedStatus,
                ofDateFrom: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("start").value.toISOString()),
                ofDateTo: this.getDateStringFromISODate(this.cooperationOrdersDateRangeFormGroup.get("end").value.toISOString())
            }]);
    }

    allowedToChangeDocumentTypeUI() {
        var retVal = false;

        //we only allow changing document type if document is not saved yet, in creation mode
        if (this.selectedCooperationOrderData && this.selectedCooperationOrderData.recordId === 0) {
            retVal = true;
        }

        return retVal;
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
    onTakeoverPositionSearch(params) {
        this.cooperationOrderTakeoverPositionGrid.api.setQuickFilter(params.target.value);
    }

    //Performs search of takeovers in ag-grid
    onTakeoverSearch(params) {
        this.cooperationTakeoverGrid.api.setQuickFilter(params.target.value);
    }

    //! DOCUMENT HEAD ACTIONS

    //Action saves or updates cooperation takeover
    onSaveOrUpdateCooperationTakeover(event) {
        //Do nothing, can't save or update for now
    }

    //Action closes supplier order on DocumentHead
    onCloseSupplierOrder() {
        if (this.selectedCooperationOrderData.recordId == 0) {
            this.selectedCooperationOrderData = {};
        }
    }

    //Action confirms supplier order on DocumentHead
    onConfirmCooperationTakeover(event) {
        if (this.cooperationOrderTakeoverPositionGrid) {
            this.cooperationOrderTakeoverPositionGrid.api.stopEditing(false); //Pass true if you want to cancel the editing (i.e. don't accept changes).
        }

        //Confirmation dialog
        let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            height: 'auto',
            width: '40%'
        });

        this.translateService.get(['SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.confirm_action_title', 'DATA.yes', 'DATA.no', 'SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.confirm_action_text']).subscribe((tResult: string) => {
            dialogRef.componentInstance.actionCancel = tResult["DATA.no"];
            dialogRef.componentInstance.actionYes = tResult["DATA.yes"];
            dialogRef.componentInstance.dialogText = tResult["SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.confirm_action_text"];
            dialogRef.componentInstance.dialogTitle = tResult["SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.confirm_action_title"];
        });

        dialogRef.afterClosed().subscribe((result) => {

            if (result && result === 'ok') {
                var postCooperationOrderTakeoverConfirmRequest = new PostCooperationOrderTakeoverConfirmRequest;
                postCooperationOrderTakeoverConfirmRequest.cooperationOrderId = this.selectedCooperationOrderData.recordId;
                postCooperationOrderTakeoverConfirmRequest.positions = [];

                this.cooperationOrderTakeoverPositionData.forEach(function (item) {
                    var quantityString = "0";

                    if (item.quantityTakeover) {
                        quantityString = item.quantityTakeover.toString()
                    }

                    var positionItem: CooperationOrderTakeoverPositionRequestData =
                    {
                        workOrderOperationId: item.workOrderOperationId,
                        quantityString: quantityString,
                        description: item.description
                    };
                    postCooperationOrderTakeoverConfirmRequest.positions.push(positionItem);
                });

                this.loadingBusy.busy.push(this.procurementService.confirmCooperationOrderTakeover(postCooperationOrderTakeoverConfirmRequest).subscribe(
                    (success) => {
                        this.getTakeoverPositions(this.selectedCooperationOrderData.recordId);
                        this.getTakeovers(this.selectedCooperationOrderData.recordId);

                        this.currentTabIndex = 1;

                        this.router.navigate(['procurement/cooperation/takeovers',
                            {
                                ofRowId: this.selectedCooperationOrderData.recordId,
                                ofStatus: CooperationOrderStatusEnum.active,
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

    //! DOCUMENT POSITION ACTIONS

    //Creates or updates supplier order positions
    onSaveOrUpdateCooperationOrderTakeoverPosition(event) {
        var rowData: CooperationOrderTakeoverPositionData = event.data;
        var rowNode: RowNode = event.node;

        var quantityInput = rowData.quantityTakeover;

        if (quantityInput) {
            var conversionRequest = new GetProductConversionQuantityRequest();
            conversionRequest.quantity = quantityInput.toString();
            conversionRequest.converter = 1;

            this.loadingBusy.busy.push(this.codeTableService.getQuantityConversion(conversionRequest).subscribe(
                (response) => {
                    rowData.quantityTakeover = response;
                    rowNode.setData(rowData);
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
                }
            ))
        }
        else {
            rowData.quantityTakeover = 0;
            rowNode.setData(rowData);
            this.setDocumentActionPermissions();
        }
    }

    private handleEmptyGridColumns(documentId: number, rowNode: RowNode) {
        switch (documentId) {
            //DocumentPositions
            case 1:
                if (this.cooperationOrderTakeoverPositionGrid) {
                    var nodes = this.cooperationOrderTakeoverPositionGrid.api.getRenderedNodes();

                    if (nodes.filter(x => !x.data.recordId).length > 0) {
                        rowNode = nodes[0];
                        this.cooperationOrderTakeoverPositionGrid.api.applyTransaction({ remove: [rowNode.data] });
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

    onFillTakeoverQuantities()
    {
        this.cooperationOrderTakeoverPositionData.forEach(function (item) 
        {
            item.quantityTakeover = item.quantityToTakeover;
        });
        this.cooperationOrderTakeoverPositionsGridOptions.api.setRowData(this.cooperationOrderTakeoverPositionData);
    }

    //! DOCUMENT TAKEOVERS ACTIONS

    //TAKEOVER - create  PDF report
    onExportTakeoverPDF(params) {
        if (params && params.data) {
            this.generateTakeoverPdfReport(this.chosenCooperationOrderNode.data, params.data)
        }
    }

    //! CONTEXT MENUS START

    //Menu, when user right clicks on supplier orders ag-grid
    getCooperationOrderContextMenuItems(params) {
        var result = [];
        var context: CooperationTakeoverComponent = params.context;
        var copy = "copy";
        var rowNode: RowNode = params.node;
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

        var separator = "separator";

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

        if (context.hasReadWritePermissions) {
            result.push(separator);
            result.push(exportExcel);
        }

        return result;
    }

    //Build the menu, when user right clicks on takeover positions ag-grid
    getTakeoverPositionContextMenuItems(params) {
        var result = [];
        var context: CooperationTakeoverComponent = params.context;
        var copy = "copy";
        var rowNode: RowNode = params.node;
        var gridApi: GridApi = params.api;
        var separator = "separator";

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
                    gridApi.startEditingCell({ rowIndex: rowNode.rowIndex, colKey: 'quantityTakeover' });
                }, 1);
            },
            icon: "<span class='fas fa-pencil-alt'></span>"
        };

        var exportExcel = {
            name: context.translateService.instant("FORMS.FIELDS.exportExcel"),
            action: function () {
                params.api.exportDataAsExcel();
            },
            icon: "<span class='fa fa-file-excel-o'></span>"
        };

        if (context.hasReadWritePermissions) {
            if (!context.saveOrUpdateDisabled) {
                result.push(editAction)
                result.push(separator);
            }
        }

        if (context.hasReadPermissions) {
            result.push(copy);
            result.push(exportExcel);
        }

        return result;
    }

    getTakeoverContextMenuItems(params) {
        var result = [];
        var context: CooperationTakeoverComponent = params.context;
        var copy = "copy";
        var rowNode: RowNode = params.node;
        var gridApi: GridApi = params.api;
        var rowData: CooperationTakeoverData = params.node.data;
        var separator = "separator";

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

        var exportExcel = {
            name: context.translateService.instant("FORMS.FIELDS.exportExcel"),
            action: function () {
                params.api.exportDataAsExcel();
            },
            icon: "<span class='fa fa-file-excel-o'></span>"
        };

        var showTakeoverPositionsAction = {
            name: params.context.translateService.instant("SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.takeover_positions"),
            action: function () {
                context.onShowTakeoverPositionsDialog(context, rowNode.data);
            },
            icon: "<span class='fas fa-list'></span>"
        };

        var exportPDf = {
            name: context.translateService.instant("SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.exportTakeoverReport"),
            action: function () {
                context.onExportTakeoverPDF(rowNode);
            },
            icon: "<span class='fa fa-file-pdf-o'></span>"
        };

        var cancelTakeoverAction = {
            name: context.translateService.instant("SCREEN.WORKORDERS.storno"),
            action: function () {
                //Confirmation dialog
                let dialogRef = context.dialog.open(ConfirmationDialogComponent, {
                    height: 'auto',
                    width: '40%'
                });

                context.translateService.get(['SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.cancel_action_title', 'DATA.yes', 'DATA.no', 'SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.cancel_action_text']).subscribe((tResult: string) => {
                    dialogRef.componentInstance.actionCancel = tResult["DATA.no"];
                    dialogRef.componentInstance.actionYes = tResult["DATA.yes"];
                    dialogRef.componentInstance.dialogText = tResult["SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.cancel_action_text"];
                    dialogRef.componentInstance.dialogTitle = tResult["SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.cancel_action_title"];
                });

                dialogRef.afterClosed().subscribe((result) => {
                    if (result && result === 'ok') {

                        //remove from server
                        var request: PostCooperationOrderTakeoverCancelRequest = new PostCooperationOrderTakeoverCancelRequest();
                        request.cooperationTakeoverId = rowData.recordId;

                        context.loadingBusy.busy.push(context.procurementService.cancelCooperationOrderTakeover(request).subscribe(
                            {
                                next: () => {
                                    //Loads position tabs
                                    if (params.context.selectedCooperationOrderData && params.context.selectedCooperationOrderData.recordId) {
                                        params.context.getTakeoverPositions(params.context.selectedCooperationOrderData.recordId);
                                        params.context.getTakeovers(params.context.selectedCooperationOrderData.recordId);
                                    }
                                },
                                error: (exception) => {
                                    var errorCode: ResultCodeEnum = exception.error.resultCode;
                                    var resultCode = "RESULT_CODES." + ResultCodeEnum[errorCode];

                                    context.translateService.get(["RESULT_CODES.error_title", resultCode]).subscribe(
                                        (tResult: string) => {
                                            //Remove from grid
                                            Swal.fire(tResult["RESULT_CODES.error_title"], tResult[resultCode], 'error');
                                        }
                                    )
                                }
                            }
                        ))

                    }
                })
            },
            icon: "<span class='fas fa-ban '></span>"
        };

        if (context.hasReadPermissions) {
            result.push(showTakeoverPositionsAction);
            result.push(exportPDf);
            result.push(separator);

        }
        if (context.hasReadWritePermissions) 
        {
            if(rowData.status == CooperationOrderStatusEnumStrings.active || rowData.status == CooperationOrderStatusEnumStrings.completed)
            {
                result.push(cancelTakeoverAction);
                result.push(separator);
            }    
        }

        result.push(copy);
        result.push(exportExcel);

        return result;
    }

    //! Private Methods START

    private getScreenData(cooperationOrderId?: number, cooperationOrderStatus?: CooperationOrderStatusEnum, dateFrom?: string, dateTo?: string) {
        //Handle cooperationorder request
        let cooperationOrderRequest = null;
        if (cooperationOrderId) {
            if (cooperationOrderId != 0) {
                var getCooperationOrderRequest = new GetCooperationOrderRequest();
                getCooperationOrderRequest.recordId = cooperationOrderId;
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

        this.loadingBusy.busy.push(forkJoin({
            cooperationOrders: cooperationOrderRequest
        }).subscribe(({ cooperationOrders }) => {
            //Loading the specific order
            if (cooperationOrders != null) {
                if (cooperationOrderId) {
                    this.selectedCooperationOrderData = cooperationOrders["data"][0];

                    //Loads position tabs
                    if (this.selectedCooperationOrderData && this.selectedCooperationOrderData.recordId) {
                        this.getTakeoverPositions(this.selectedCooperationOrderData.recordId);
                        this.getTakeovers(this.selectedCooperationOrderData.recordId);
                    }

                    //Select the right node in grid
                    var renderedNodes = this.cooperationOrderGrid.api.getRenderedNodes();
                    renderedNodes.forEach(node => {
                        if (node.data.recordId == cooperationOrderId) {
                            node.setSelected(true, true);
                            this.cooperationOrderGrid.api.ensureIndexVisible(node.rowIndex);
                        }
                    })
                }
                //Loading all orders
                else {
                    this.cooperationOrdersData = cooperationOrders["data"];
                }
            }

            var columnDefs: any = this.getStaticColumns();
            this.cooperationOrderGrid.api.setColumnDefs([]);
            this.cooperationOrderGrid.api.setColumnDefs(columnDefs);

            this.setDocumentActionPermissions();

            this.getAgGridState(ScreenTypeFactoryEnum.cooperationTakeoversScreen, this.cooperationTakeoversGridOptions);
        }));

    }

    private getStaticColumns() {
        var staticColumnDef = [
            {
                headerName: "FORMS.FIELDS.state",
                field: "status",
                sortable: true,
                resizable: true,
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
                headerName: "SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.order_number",
                field: "code",
                sortable: true,
                resizable: true,
                editable: false,
                filter: 'agTextColumnFilter',
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
                resizable: true,
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
                resizable: true,
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
                resizable: true,
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
                resizable: true,
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
                resizable: true,
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
                resizable: true,
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
                resizable: true,
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

    private getStaticTakeoverPositionColumns() {
        var staticColumnDef = [
            {
                headerName: "FORMS.FIELDS.state",
                field: "status",
                sortable: true,
                resizable: true,
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
                            return '<center><div class="circle_black" style="margin-top: 8px;" /></center>';
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
                headerName: "SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.productCode",
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
                headerName: "SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.productName",
                field: "productName",
                sortable: true,
                resizable: true,
                minWidth: 100,
                editable: false,
                filter: 'agSetColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                    valueFormatter: (params) => {
                        if (params.value) {
                            return params.context.positionProductData.filter(c => c.recordId == parseInt(params.value))[0].name;
                        }
                    }
                },
                headerValueGetter: this.localizeHeader.bind(this),
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.workOrderOperationCode",
                field: "workOrderOperationCode",
                sortable: true,
                resizable: true,
                minWidth: 150,
                editable: false,
                filter: 'agSetColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep'
                },
                headerValueGetter: this.localizeHeader.bind(this),
                valueFormatter: (params) => 
                {
                    return params.data.workOrderOperationCode + "/" + params.data.workOrderOperationExecutionPosition;
                },
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.quantityOrder",
                field: "quantityOrder",
                sortable: true,
                editable: false,
                width: 150,
                filter: 'agNumberColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
                valueFormatter: (params) => {
                    if (params.data.quantityOrder) {
                        return this.numberFormatter(params.data.quantityOrder, params.context.locale);
                    }
                    else {
                        return this.numberFormatter(0, params.context.locale);
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.quantityTakeovered",
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
                valueFormatter: (params) => {
                    if (params.data.quantityTakeovered) {
                        return this.numberFormatter(params.data.quantityTakeovered, params.context.locale);
                    }
                    else {
                        return this.numberFormatter(0, params.context.locale);
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.quantityToTakeover",
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
                valueFormatter: (params) => {
                    if (params.data.quantityToTakeover) {
                        return this.numberFormatter(params.data.quantityToTakeover, params.context.locale);
                    }
                    else {
                        return this.numberFormatter(0, params.context.locale);
                    }
                }
            },
            {
                headerName: "SCREEN.description",
                field: "description",
                sortable: true,
                editable: function (params) {
                    return params.context.allowedToManipulateUIElements;
                },
                suppressKeyboardEvent: (params) => {
                    this.isAllowedToEnterEditModeWithKeyboardKeys(params);
                },
                filter: 'agTextColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
                cellClass: function (params) {
                    if (params.context.allowedToManipulateUIElements) {
                        return 'lightgreen-background';
                    }
                    else {
                        return '';
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.quantityTakeover",
                field: "quantityTakeover",
                sortable: true,
                editable: function (params) {
                    return params.context.allowedToManipulateUIElements;
                },
                suppressKeyboardEvent: (params) => {
                    this.isAllowedToEnterEditModeWithKeyboardKeys(params);
                },
                width: 150,
                filter: 'agNumberColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
                valueGetter: (params) => {
                    if (!isNaN(params.data.quantityTakeover) && params.data.quantityTakeover != null) {
                        params.data.quantityTakeover = this.numberFormatter(params.data.quantityTakeover, params.context.locale);
                        return params.data.quantityTakeover;
                    }
                    else {
                        return params.data.quantityTakeover;
                    }
                },
                cellEditorFramework: AgGridInputCellEditorComponent,
                cellEditorParams: {
                    required: true
                },
                cellClass: function (params) {
                    if (params.context.allowedToManipulateUIElements) {
                        return 'lightgreen-background';
                    }
                    else {
                        return '';
                    }
                }
            },

        ];

        return staticColumnDef;
    }

    private getStaticTakeoversColumns() {
        var staticColumnDef = [
            {
                headerName: "FORMS.FIELDS.state",
                field: "status",
                sortable: true,
                resizable: true,
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
                headerName: "SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.takeover_number",
                headerValueGetter: this.localizeHeader.bind(this),
                field: "code",
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
                headerName: "SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.bookedDate",
                field: "bookedDate",
                sortable: true,
                resizable: true,
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
                headerName: "SCREEN.confirmed_by",
                field: "modifiedBy",
                sortable: true,
                editable: false,
                filter: 'agSetColumnFilter',
                filterParams: {
                    buttons: ["reset"],
                    newRowsAction: 'keep',
                },
                headerValueGetter: this.localizeHeader.bind(this),
            },
            {
                headerName: "SCREEN.modified_date",
                field: "modifiedDate",
                sortable: true,
                resizable: true,
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
                priceCalculationTypeName: ["", Validators.required],
            });

        this.cooperationOrderDetailsForm.markAllAsTouched();

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

        this.allowedToManipulateUIElements = this.allowedToManipulateUI();
        this.allowedToChangeDocumentType = this.allowedToChangeDocumentTypeUI();
    }

    //Controls if SaveOrUpdate document action is allowed
    private isSaveOrUpdateDisabled() {
        var retVal: boolean = true;

        //1. First we check the permissions
        if (this.hasReadWritePermissions) {
            //Check cooperation order status
            if (this.selectedCooperationOrderData.status == CooperationOrderStatusEnumStrings.active) {
                retVal = false;
            }
        }

        return retVal;
    }

    //Controls if Authorize document action is allowed
    private isAuthorizeDisabled() {
        var retVal: boolean = true;

        //1. First we check the permissions
        if (this.hasReadWritePermissions) {
            //Check cooperation order status
            if (this.selectedCooperationOrderData.status == CooperationOrderStatusEnumStrings.active) {
                retVal = false;
            }
        }

        return retVal;

    }

    //Controls if user is allowed to manipulate UI elements
    private allowedToManipulateUI() {
        var retVal = false;

        if (this.hasReadWritePermissions) {
            //Check cooperation order status
            if (this.selectedCooperationOrderData.status == CooperationOrderStatusEnumStrings.active) {
                retVal = true;
            }
        }

        return retVal;
    }

    //Method loads positions from the server
    private getTakeoverPositions(cooperationOrderId: number) {

        var getCooperationOrderTakeoverPositionRequest = new GetCooperationOrderTakeoverPositionRequest()
        getCooperationOrderTakeoverPositionRequest.cooperationOrderId = cooperationOrderId;

        this.loadingBusy.busy.push(forkJoin({
            takeoverPositions: this.procurementService.getCooperationOrderTakeoverPositions(getCooperationOrderTakeoverPositionRequest)
        }).subscribe(({ takeoverPositions }) => {
            this.cooperationOrderTakeoverPositionData = takeoverPositions.data;

            var columnDefs: any = this.getStaticTakeoverPositionColumns();
            this.cooperationOrderTakeoverPositionGrid.api.setColumnDefs([]);
            this.cooperationOrderTakeoverPositionGrid.api.setColumnDefs(columnDefs);
        }));
    }

    //Method loads positions from the server
    private getTakeovers(cooperationOrderId: number) {

        var getCooperationTakeoverRequest = new GetCooperationTakeoverRequest()
        getCooperationTakeoverRequest.cooperationOrderId = cooperationOrderId;

        this.loadingBusy.busy.push(forkJoin({
            takeovers: this.procurementService.getCooperationTakeovers(getCooperationTakeoverRequest)
        }).subscribe(({ takeovers }) => {
            this.cooperationTakeoverData = takeovers.data;

            var columnDef: any = this.getStaticTakeoversColumns();
            this.cooperationTakeoverGrid.api.setColumnDefs([]);
            this.cooperationTakeoverGrid.api.setColumnDefs(columnDef);
        }));

    }

    private onShowTakeoverPositionsDialog(context?: CooperationTakeoverComponent, rowData?: CooperationTakeoverData) {
        let dialogRef = context.dialog.open(CooperationTakeoverPositionsDialogComponent, {
            height: '90%',
            width: '90%',
            panelClass: 'code-table-dialog',
            data: rowData,
            disableClose: false
        });

        dialogRef.afterClosed().subscribe((result) => {
            //Refresh client data
            if (this.selectedCooperationOrderData && this.selectedCooperationOrderData.recordId) {
                this.getTakeoverPositions(this.selectedCooperationOrderData.recordId);
                this.getTakeovers(this.selectedCooperationOrderData.recordId);
            }
        });
    }

    //! REPORTS

    private generateTakeoverPdfReport(cooperationOrderData: CooperationOrderData, takeoverData: CooperationTakeoverData) {

        var getCooperationTakeoverPositionRequest: GetCooperationTakeoverPositionRequest = new GetCooperationTakeoverPositionRequest();
        getCooperationTakeoverPositionRequest.cooperationTakeoverId = takeoverData.recordId;

        var getCooperantRequest: GetSupplierRequest = new GetSupplierRequest;
        getCooperantRequest.recordId = cooperationOrderData.supplierId;

        this.loadingBusy.busy.push(forkJoin({
            companies: this.codeTableService.getCompanies(new GetCompanyRequest()),
            cooperationTakeoverPositions: this.procurementService.getCooperationTakeoverPositions(getCooperationTakeoverPositionRequest),
            cooperants: this.codeTableService.getSuppliers(getCooperantRequest),
            onlineUser: this.codeTableService.getEmployeeOnlineUser(new GetEmployeeOnlineUserRequest())
        }).subscribe(({ companies, cooperationTakeoverPositions, cooperants, onlineUser }) => {

            var companyData: CompanyData;
            var takeoverPositions = cooperationTakeoverPositions.data;
            var cooperantData: SupplierData;
            var onlineUserData: EmployeeData;

            if (companies.count >= 1) {
                companyData = companies.data[0];
            }

            takeoverData.cooperationTakeoverDisclaimerText = companyData.extraLine[3];

            if (cooperants.count >= 1) {
                cooperantData = cooperants.data[0];
                if (cooperantData.addresses.length >= 1) {
                    cooperantData["defaultAddress"] = cooperantData.addresses[0];
                }
            }

            if (onlineUser.count >= 1) {
                onlineUserData = onlineUser.data[0];
            }

            //Generate report data
            var template: JsReportTemplateData = new JsReportTemplateData();
            template.name = "/procurement/cooperationTakeover/index";
            template.recipe = "chrome-pdf";

            var reportData = new JsReportBaseData();
            reportData.companyData = companyData;
            reportData.environment = environment.baseUrl;
            reportData.isTestEnvironment = this.convertToBoolean(environment.JSREPORT.isTestEnvironment);
            reportData["cooperationOrderData"] = cooperationOrderData;
            reportData["takeoverData"] = takeoverData;
            reportData["cooperantData"] = cooperantData;
            reportData["takeoverPositions"] = takeoverPositions;
            reportData["onlineUserData"] = onlineUserData;

            var jsReportRequest = new JsReportManufacturingRequest(template, reportData, this.translationFactory, this.authRepository.getOnlineUser().preferredDecimalPlaces);

            this.loadingBusy.busy.push(this.jsReportService.getReport(jsReportRequest).subscribe(
                (data) => {
                    this.jsReportService.openReport(this.translateService.instant('SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.reportName'), data);
                }
            ))
        }));
    }
}