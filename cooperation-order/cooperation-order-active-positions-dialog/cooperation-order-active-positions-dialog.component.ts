import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, RowNode, GridApi } from 'ag-grid-community';
import { IBusyConfig } from 'ng-busy';
import { Subscription, of, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthenticationRepository } from '../../../../../Truster.Core.UI.Authentication/repositories/authentication.repository';
import { CodeTableService } from '../../../../../Truster.Core.UI.CodeTable/services/code-table.service';
import { GetWorkOrderOperationPrinterRequest } from '../../../../../Truster.Core.UI.Manufacturing/commands/requests/get.workorder.operation.printer.request';
import { TechnologicalProcedureProductData } from '../../../../../Truster.Core.UI.Manufacturing/helpers/technological-procedure-product-data';
import { WorkOrderStatusEnumStrings } from '../../../../../Truster.Core.UI.Manufacturing/helpers/work-order-status-enum-strings';
import { ManufacturingService } from '../../../../../Truster.Core.UI.Manufacturing/services/manufacturing.service';
import { ScreensFactory } from '../../../../../Truster.Core.UI.Permission/factories/screens.factory';
import { PermissionRepository } from '../../../../../Truster.Core.UI.Permission/repositories/permission.repository';
import { AgGridBaseComponent } from '../../../../../Truster.Core.UI.SharedUIComponents/ag-grid/ag-grid-base/ag-grid-base.component';
import { PermissionTypeService } from '../../../../../Truster.Core.UI.SharedUIComponents/interfaces/permission.type.service';
import { ScreenTypeService } from '../../../../../Truster.Core.UI.SharedUIComponents/interfaces/screen.type.service';
import { BusyConfigFactory } from '../../../../../Truster.Core.UI.SharedUIComponents/loading-spinner/busy.config.factory';
import { DatePipeProxy } from '../../../../../Truster.Core.UI.SharedUIComponents/pipes/date.pipe.proxy';
import { AgGridService } from '../../../../../Truster.Core.UI.SharedUIComponents/services/ag-grid.service';
import { SnackbarService } from '../../../../../Truster.Core.UI.SharedUIComponents/services/snackbar.service';
import { TranslationFactory } from '../../../../../Truster.Core.UI.Translation/factories/translation.factory';
import { GetCooperationOrderAnalyticsRequest } from '../../../../commands/requests/get.cooperation.order.analytics.request';
import { GetCooperationOrderAvailableWorkOrderOperationsRequest } from '../../../../commands/requests/get.cooperation.order.available.workorder.operations.request';
import { CooperationOrderPositionStatusEnum } from '../../../../helpers/cooperation-order-position-status-enum';
import { AvailableCooperationWorkOrderOperationData } from '../../../../helpers/cooperation-work-order-operation-available-data';
import { ProcurementService } from '../../../../services/procurement.service';

@Component({
    selector: 'cooperation-order-active-positions-dialog',
    templateUrl: 'cooperation-order-active-positions-dialog.component.html',
    styleUrls: ['cooperation-order-active-positions-dialog.component.scss']
})

export class CooperationOrderActivePositionsDialogComponent extends AgGridBaseComponent implements OnInit, OnDestroy {

    private activeCooperationPositionGrid: AgGridAngular;
    @ViewChild('activeCooperationPositionGrid', { static: false }) set woGrid(component: AgGridAngular) {
        if (component) {
            this.activeCooperationPositionGrid = component;
        }
    };

    dialogRef = null;
    dialogData: any = null;
    dialogTitle: string;
    cooperationOrderActiveDialogDateRangeFormGroup: FormGroup;
    statusData = this.enumToArray(CooperationOrderPositionStatusEnum);
    selectedStatus: CooperationOrderPositionStatusEnum = CooperationOrderPositionStatusEnum.active;
    
    //Subscriptions
    loadingBusy: IBusyConfig = BusyConfigFactory.create();
    activeCooperationPositionsBusy: Subscription;
    activeCooperationPositionData: AvailableCooperationWorkOrderOperationData[] = [];
    workOrderOperationId: number;

    //Locale realted properties
    locale;

    /*  materialGrid START */
    activeCooperationPositionGridOptions: GridOptions = {
        localeText: this._localeText,
        animateRows: false,
        defaultColDef: {
            width: 200,
            editable: false,
            resizable: true
        },
        rowSelection: "single",
        editType: "fullRow",
        suppressColumnVirtualisation: true,
        suppressClipboardPaste: true,
        suppressCopyRowsToClipboard: true,
        accentedSort: true,
        tabToNextCell: this.tabToNextCell.bind(this),
        enableCellChangeFlash: true,
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
    /* materialGrid END */

    constructor(private snackbarService: SnackbarService,
        public agGridService: AgGridService,
        public authRepository: AuthenticationRepository,
        private translationFactory: TranslationFactory,
        private formBuilder: FormBuilder,
        private datePipe: DatePipeProxy,
        private decimalPipe: DecimalPipe,
        public permissionRepository: PermissionRepository,
        private procurementService: ProcurementService,
        private manufacturingService: ManufacturingService,
        private dialog: MatDialog,
        public screenTypeService: ScreenTypeService,
        public permissionTypeService: PermissionTypeService,
        public translateService: TranslateService,
        public screensFactory: ScreensFactory,
        private changeDetector: ChangeDetectorRef,
        private injector: Injector,
        public renderer: Renderer2) {
        super(agGridService, translateService, authRepository, permissionRepository, screenTypeService, permissionTypeService, screensFactory, renderer)
        this.dialogRef = injector.get(MatDialogRef, null);
        this.dialogData = injector.get(MAT_DIALOG_DATA, null);


        this.locale = this.translationFactory.getPreferredLanguage().name;

        this.dialogTitle = this.translateService.instant("SCREEN.analyticsView");
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
        this.checkUIPermissions("purchaseCooperationOrder", "purchaseCooperationOrderManagement");
        
        this.initializeClassForms()

        //Load data to grid
        var getCooperationOrderAvailableWorkOrderOperationsRequest = new GetCooperationOrderAvailableWorkOrderOperationsRequest();
        getCooperationOrderAvailableWorkOrderOperationsRequest.isCooperationComplete = false;

        this.getScreenData()
    }

    //!  Angular Functions END 


    //! PUBLIC Methods START

    closeDialog() {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    getActiveCooperationPositionContextMenuItems(params) {

        var result = [];
        var context: CooperationOrderActivePositionsDialogComponent = params.context;
        var copy = "copy";
        var rowData = params.node?.data;
        var rowNode: RowNode = params.node;

        setTimeout(() => {
            rowNode.setSelected(true, true);
        }, 1);

        var gridApi: GridApi = params.api;

        var exportExcel =
        {
            name: context.translateService.instant("FORMS.FIELDS.exportExcel"),
            action: function () {
                params.api.exportDataAsExcel();
            },
            icon: "<span class='fa fa-file-excel-o'></span>"
        };

        if (rowData) {
            result.push(copy);
            result.push(exportExcel);
        }


        return result;
    }

    onSearch(params) {
        this.activeCooperationPositionGrid.api.setQuickFilter(params.target.value);
    }

    onStatusChanged(event) {
        this.getScreenData();
    }

    onDateFilterChanged(event) 
    {   
        if (event.value != null) {
            this.getScreenData();
        }
    }

    //! PUBLIC METHODS END 

    //! PRIVATE Methods START

    //Takes care about ag-grid columns
    private getStaticColumns() {
        var columnns = [
            {
                headerName: "SCREEN.WORKORDERS.resource",
                headerValueGetter: this.localizeHeader.bind(this),
                field: "resourceCode",
                sortable: true,
                editable: false,
                filter: 'agTextColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                },
                width: 150
            },
            {
                headerName: "SCREEN.WORKORDERS.status",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'status',
                sortable: true,
                width: 80,
                editable: false,
                filter: 'agSetColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                    valueFormatter: (params) => this.statusValueFormatter(params)
                },
                tooltipValueGetter: (params) => this.translateService.instant('SCREEN.WORKORDERS.' + params.value),
                cellRenderer: function (params) {
                    if (params.data != null && params.data.status != null) {

                        if (params.data.status == WorkOrderStatusEnumStrings.active) {
                            return '<center><div class="circle_green" style="margin-top: 8px;" /></center>';
                        }
                        else if (params.data.status == WorkOrderStatusEnumStrings.storno) {
                            return '<center><div class="circle_red" style="margin-top: 8px;" /></center>';
                        }
                        else if (params.data.status == WorkOrderStatusEnumStrings.preparation) {
                            return '<center><div class="circle_orange" style="margin-top: 8px;" /></center>';
                        }
                        else if (params.data.status == WorkOrderStatusEnumStrings.inProduction) {
                            return '<center><div class="circle_blue" style="margin-top: 8px;" /></center>';
                        }
                        else if (params.data.status == WorkOrderStatusEnumStrings.delete) {
                            return '<center><div class="circle_black" style="margin-top: 8px;" /></center>';
                        }
                        else if (params.data.status == WorkOrderStatusEnumStrings.complete) {
                            return '<center><div class="fas fa-check-circle circle_completed" style="margin-top: 8px;" /></center>';
                        }
                    }
                }
            },
            {
                headerName: "SCREEN.WORKORDERS.executionPosition",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'executionPosition',
                width: 120,
                sortable: true,
                editable: false,
                filter: 'agTextColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', }
            },
            {
                headerName: "SCREEN.WORKORDERS.workOrderOperationCode",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'code',
                width: 120,
                sortable: true,
                editable: false,
                filter: 'agTextColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', }
            },
            {
                headerName: "SCREEN.WORKORDERS.productionOrderCode",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'productionOrderCode',
                width: 150,
                sortable: true,
                editable: false,
                filter: 'agTextColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', },
            },
            {
                headerName: "SCREEN.WORKORDERS.customerOrderCode",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'customerOrderCode',
                width: 150,
                sortable: true,
                editable: false,
                filter: 'agTextColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', },
            },
            {
                headerName: "SCREEN.WORKORDERS.cooperationOrderCode",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'cooperationOrderCodes',
                width: 200,
                sortable: true,
                editable: false,
                filter: 'agTextColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', },
            },
            {
                headerName: "SCREEN.WORKORDERS.workOperation",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'workplaceName',
                width: 250,
                sortable: true,
                editable: false,
                filter: 'agTextColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', },
            },
            {
                headerName: "SCREEN.WORKORDERS.productCode",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'productCode',
                width: 200,
                sortable: true,
                editable: false,
                filter: 'agTextColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', }
              },
              {
                headerName: "SCREEN.WORKORDERS.productName",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'productName',
                width: 300,
                sortable: true,
                editable: false,
                filter: 'agTextColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', }
              },
            {
                headerName: "SCREEN.WORKORDERS.quantity",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'quantityPlanned',
                width: 100,
                sortable: true,
                editable: false,
                filter: 'agNumberColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep' },
                valueFormatter: (params) => 
                {
                    if (params.data.quantityPlanned) 
                    {
                        return this.numberFormatter(params.data.quantityPlanned, params.context.locale);
                    }
                    else
                    {
                        return this.numberFormatter(0, params.context.locale);
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.quantityOrdered",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'quantityOrdered',
                width: 120,
                sortable: true,
                editable: false,
                filter: 'agNumberColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', },
                valueFormatter: (params) => 
                {
                    if (params.data.quantityOrdered) 
                    {
                        return this.numberFormatter(params.data.quantityOrdered, params.context.locale);
                    }
                    else
                    {
                        return this.numberFormatter(0, params.context.locale);
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.quantityToOrder",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'quantityToOrder',
                width: 120,
                sortable: true,
                editable: false,
                filter: 'agNumberColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', },
                valueFormatter: (params) => 
                {
                    if (params.data.quantityToOrder) 
                    {
                        return this.numberFormatter(params.data.quantityToOrder, params.context.locale);
                    }
                    else
                    {
                        return this.numberFormatter(0, params.context.locale);
                    }
                },
                cellClass: function (params) {
                    if (params.data.quantityToOrder > 0) {
                        return 'lightorange-background';
                    }
                    else {
                        return '';
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONISSUES.quantityIssued",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'quantityIssued',
                width: 120,
                sortable: true,
                editable: false,
                filter: 'agNumberColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', },
                valueFormatter: (params) => 
                {
                    if (params.data.quantityIssued) 
                    {
                        return this.numberFormatter(params.data.quantityIssued, params.context.locale);
                    }
                    else
                    {
                        return this.numberFormatter(0, params.context.locale);
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONISSUES.quantityToIssue",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'quantityToIssue',
                width: 120,
                sortable: true,
                editable: false,
                filter: 'agNumberColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', },
                valueFormatter: (params) => 
                {
                    if (params.data.quantityToIssue) 
                    {
                        return this.numberFormatter(params.data.quantityToIssue, params.context.locale);
                    }
                    else
                    {
                        return this.numberFormatter(0, params.context.locale);
                    }
                },
                cellClass: function (params) {
                    if (params.data.quantityToIssue > 0) {
                        return 'lightorange-background';
                    }
                    else {
                        return '';
                    }
                }
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.quantityTakeovered",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'quantityTakeovered',
                width: 120,
                sortable: true,
                editable: false,
                filter: 'agNumberColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', },
                valueFormatter: (params) => 
                {
                    if (params.data.quantityTakeovered) 
                    {
                        return this.numberFormatter(params.data.quantityTakeovered, params.context.locale);
                    }
                    else
                    {
                        return this.numberFormatter(0, params.context.locale);
                    }
                },
            },
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.quantityToTakeover",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'quantityToTakeover',
                width: 120,
                sortable: true,
                editable: false,
                filter: 'agNumberColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', },
                valueFormatter: (params) => 
                {
                    if (params.data.quantityToTakeover) 
                    {
                        return this.numberFormatter(params.data.quantityToTakeover, params.context.locale);
                    }
                    else
                    {
                        return this.numberFormatter(0, params.context.locale);
                    }
                },
                cellClass: function (params) {
                    if (params.data.quantityToTakeover > 0) {
                        return 'lightorange-background';
                    }
                    else {
                        return '';
                    }
                }
            },
        ];

        return columnns;
    }

    private getScreenData() {

        var getCooperationOrderAnalyticsRequest: GetCooperationOrderAnalyticsRequest = new GetCooperationOrderAnalyticsRequest();
        getCooperationOrderAnalyticsRequest.status = CooperationOrderPositionStatusEnum[this.selectedStatus];

        if (this.cooperationOrderActiveDialogDateRangeFormGroup.get("start").value && this.cooperationOrderActiveDialogDateRangeFormGroup.get("end").value) {

            getCooperationOrderAnalyticsRequest.startDate = this.getDateStringFromISODate(this.cooperationOrderActiveDialogDateRangeFormGroup.get("start").value.toISOString());
            getCooperationOrderAnalyticsRequest.endDate = this.getDateStringFromISODate(this.cooperationOrderActiveDialogDateRangeFormGroup.get("end").value.toISOString());
        }
        this.loadingBusy.busy.push(this.procurementService.getCooperationOrderAnalytics(getCooperationOrderAnalyticsRequest).subscribe(
            (success) => {
                setTimeout(() => {
                    var columnDefs: any = this.getStaticColumns();
                    this.activeCooperationPositionGrid.api.setColumnDefs([]);
                    this.activeCooperationPositionGrid.api.setColumnDefs(columnDefs);
                }, 1);

                this.activeCooperationPositionData = success.data;
            }
        ))
    }

    private initializeClassForms() {
        //For date range
        var today = new Date();

        this.cooperationOrderActiveDialogDateRangeFormGroup = this.formBuilder.group({
            start: new FormControl(new Date(today.setMonth(today.getMonth() - 1))),
            end: new FormControl(new Date())
        });
    }

    //! PRIVATE Methods END
}
