import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, RowNode, GridApi } from 'ag-grid-community';
import { IBusyConfig } from 'ng-busy';
import { Subscription } from 'rxjs';
import { AuthenticationRepository } from '../../../../../Truster.Core.UI.Authentication/repositories/authentication.repository';
import { DocumentStatusCodeEnum } from '../../../../../Truster.Core.UI.CodeTable/helpers/document-status-code-enum';
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
import { GetCooperationOrderPositionsRequest } from '../../../../commands/requests/get.cooperation.order.positions.request';
import { CooperationOrderPositionStatusEnum } from '../../../../helpers/cooperation-order-position-status-enum';
import { CooperationOrderPositionsData } from '../../../../helpers/cooperation-order-positions-data';
import { ProcurementService } from '../../../../services/procurement.service';

@Component({
    moduleId: module.id,
    selector: 'cooperation-order-position-prices-dialog',
    templateUrl: 'cooperation-order-position-prices-dialog.component.html',
    styleUrls: ['cooperation-order-position-prices-dialog.component.scss']
})
export class CooperationOrderPositionPricesDialogComponent extends AgGridBaseComponent implements OnInit, OnDestroy {

    private reportGrid: AgGridAngular;
    @ViewChild('reportGrid', { static: false }) set woGrid(component: AgGridAngular) {
        if (component) {
            this.reportGrid = component;
        }
    };

    dialogRef = null;
    dialogData: any = null;
    dialogTitle: string;
    reportDateRangeFormGroup: FormGroup;
    statusData = this.enumToArray(CooperationOrderPositionStatusEnum);
    selectedStatus: CooperationOrderPositionStatusEnum = CooperationOrderPositionStatusEnum.active;
    
    //Subscriptions
    loadingBusy: IBusyConfig = BusyConfigFactory.create();
    reportBusy: Subscription;
    reportData: CooperationOrderPositionsData[] = [];
    workOrderOperationId: number;

    //Locale realted properties
    locale;

    /*  GRID START */
    reportGridOptions: GridOptions = {
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
    /* GRID END */

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

        this.dialogTitle = this.translateService.instant("SCREEN.PROCUREMENT.COOPERATIONORDERS.positionPricesView");
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

        this.getScreenData()
    }

    //!  Angular Functions END 


    //! PUBLIC Methods START

    closeDialog() {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    getContextMenuItems(params) {

        var result = [];
        var context: CooperationOrderPositionPricesDialogComponent = params.context;
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
        this.reportGrid.api.setQuickFilter(params.target.value);
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
            //Status
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
            //Številka naročila (COPO)
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.order_number",
                headerValueGetter: this.localizeHeader.bind(this),
                field: "cooperationOrderCode",
                sortable: true,
                editable: false,
                width: 150,
                minWidth: 100,
                filter: 'agTextColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', }
            },
            //Dobavitelj
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.supplier",
                headerValueGetter: this.localizeHeader.bind(this),
                field: "supplierName",
                sortable: true,
                editable: false,           
                width: 300,
                minWidth: 100,
                filter: 'agTextColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', }

            },         
            //Delovni nalog
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.workOrderOperationCode",
                headerValueGetter: this.localizeHeader.bind(this),
                field: "workOrderOperationCode",
                sortable: true,
                editable: false,             
                width: 120,
                minWidth: 100,
                filter: 'agTextColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', }
            },
            //Ident
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.product",
                headerValueGetter: this.localizeHeader.bind(this),
                field: "productCode",
                sortable: true,
                editable: false,           
                width: 150,
                minWidth: 100,
                filter: 'agTextColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', }

            },
            //Naziv identa
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.productName",
                headerValueGetter: this.localizeHeader.bind(this),
                field: "productName",
                sortable: true,
                editable: false,
                width: 200,
                minWidth: 100,
                filter: 'agTextColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', } 
            },
            //Naziv operacije
            {
                headerName: "SCREEN.WORKORDERS.workOperation",
                headerValueGetter: this.localizeHeader.bind(this),
                field: "workplaceName",
                sortable: true,
                editable: false,
                width: 150,
                minWidth: 100,
                filter: 'agSetColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', }
            },
            //Naziv delovnega mesta
            {
                headerName: "SCREEN.CODETABLE.RESOURCE.resourceName",
                headerValueGetter: this.localizeHeader.bind(this),
                field: 'resourceName',
                sortable: true,
                editable: false,
                width: 200,
                minWidth: 100,
                filter: 'agTextColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', }
            },



            //Količina
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.quantityOrder",
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
            //Cena
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.salesPricePerUnitOfMeasure",
                headerValueGetter: this.localizeHeader.bind(this),
                field: "salesPrice",
                sortable: true,
                editable: false,
                width: 150,
                minWidth: 100,
                filter: 'agNumberColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', },               
                valueGetter: (params) => {
                    if (!isNaN(params.data.salesPrice) && params.data.salesPrice != null) {
                        params.data.salesPrice = this.numberPriceFormatter(params.data.salesPrice, params.context.locale);
                        return params.data.salesPrice;
                    }
                    else {
                        return params.data.salesPrice;
                    }
                }
            },
            //Vrednost
            {
                headerName: "SCREEN.value",
                headerValueGetter: this.localizeHeader.bind(this),
                field: "positionValueWithoutDiscount",
                sortable: true,
                editable: false,
                width: 150,
                minWidth: 100,
                filter: 'agNumberColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', },               
                valueGetter: (params) => {
                    if (!isNaN(params.data.positionValueWithoutDiscount) && params.data.positionValueWithoutDiscount != null) {
                        params.data.positionValueWithoutDiscount = this.numberPriceFormatter(params.data.positionValueWithoutDiscount, params.context.locale);
                        return params.data.positionValueWithoutDiscount;
                    }
                    else {
                        return params.data.positionValueWithoutDiscount;
                    }
                }
            },
            //Popust
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.discount",
                field: "discount",
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
                    if (!isNaN(params.data.discount) && params.data.discount != null) {
                        params.data.discount = this.numberFormatter(params.data.discount, params.context.locale);
                        return params.data.discount;
                    }
                    else {
                        return params.data.discount;
                    }
                },
            },
            //Vrednost popusta
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.discountValue",
                headerValueGetter: this.localizeHeader.bind(this),
                field: "discountValue",
                sortable: true,
                editable: false,
                width: 150,
                minWidth: 100,
                filter: 'agNumberColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', },               
                valueGetter: (params) => {
                    if (!isNaN(params.data.discountValue) && params.data.vatValue != null) {
                        params.data.discountValue = this.numberPriceFormatter(params.data.discountValue, params.context.locale);
                        return params.data.discountValue;
                    }
                    else {
                        return params.data.discountValue;
                    }
                }
            },
            //Vrednost s popustom
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.valueWithDiscount",
                headerValueGetter: this.localizeHeader.bind(this),
                field: "positionValue",
                sortable: true,
                editable: false,
                width: 180,
                minWidth: 100,
                filter: 'agNumberColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', },               
                valueGetter: (params) => {
                    if (!isNaN(params.data.positionValue) && params.data.positionValue != null) {
                        params.data.positionValue = this.numberPriceFormatter(params.data.positionValue, params.context.locale);
                        return params.data.positionValue;
                    }
                    else {
                        return params.data.positionValue;
                    }
                }
            },
            //Davek
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.vat",
                field: "valueAddedTaxName",
                width: 80,
                editable: false,
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
            },
            //Vrednost davka
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.vatValue",
                headerValueGetter: this.localizeHeader.bind(this),
                field: "vatValue",
                sortable: true,
                editable: false,
                width: 150,
                minWidth: 100,
                filter: 'agNumberColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', },               
                valueGetter: (params) => {
                    if (!isNaN(params.data.vatValue) && params.data.vatValue != null) {
                        params.data.vatValue = this.numberPriceFormatter(params.data.vatValue, params.context.locale);
                        return params.data.vatValue;
                    }
                    else {
                        return params.data.vatValue;
                    }
                }
            },
            //Vrednost z davkom
            {
                headerName: "SCREEN.PROCUREMENT.COOPERATIONORDERS.valueVat",
                headerValueGetter: this.localizeHeader.bind(this),
                field: "positionValueWithVat",
                sortable: true,
                editable: false,
                width: 150,
                minWidth: 100,
                filter: 'agNumberColumnFilter',
                filterParams: { buttons: ['reset'], newRowsAction: 'keep', },               
                valueGetter: (params) => {
                    if (!isNaN(params.data.positionValueWithVat) && params.data.positionValueWithVat != null) {
                        params.data.positionValueWithVat = this.numberPriceFormatter(params.data.positionValueWithVat, params.context.locale);
                        return params.data.positionValueWithVat;
                    }
                    else {
                        return params.data.positionValueWithVat;
                    }
                }
            },


            //Datum naročila
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.orderDate",
                field: "bookedDate",
                sortable: true,
                editable: false,
                filter: 'agDateColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                    comparator: this.getDateFilterComparator,
                    cellRenderer: (params) => this.dateFormatter(params, 'medium'),
                },
                headerValueGetter: this.localizeHeader.bind(this),
                cellRenderer: (params) => this.dateFormatter(params, 'medium')
            },
            //Rok naročila (pozicije)
            {
                headerName: "SCREEN.PROCUREMENT.SUPPLIERORDERS.deliveryDate",
                field: "deliveryDate",
                sortable: true,
                editable: false,
                filter: 'agDateColumnFilter',
                filterParams: {
                    buttons: ['reset'],
                    newRowsAction: 'keep',
                    comparator: this.getDateFilterComparator,
                    cellRenderer: (params) => this.dateFormatter(params, 'medium'),
                },
                headerValueGetter: this.localizeHeader.bind(this),
                cellRenderer: (params) => this.dateFormatter(params, 'medium')
            },
            
            //Datum kreacije
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
            //Spremenil
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

        return columnns;
    }

    private getScreenData() {

        var getCooperationOrderPositionsRequest: GetCooperationOrderPositionsRequest = new GetCooperationOrderPositionsRequest();

        if (this.reportDateRangeFormGroup.get("start").value && this.reportDateRangeFormGroup.get("end").value) {

            getCooperationOrderPositionsRequest.startDate = this.getDateStringFromISODate(this.reportDateRangeFormGroup.get("start").value.toISOString());
            getCooperationOrderPositionsRequest.endDate = this.getDateStringFromISODate(this.reportDateRangeFormGroup.get("end").value.toISOString());
        }
        this.loadingBusy.busy.push(this.procurementService.getCooperationOrderAllPositions(getCooperationOrderPositionsRequest).subscribe(
            (success) => {
                setTimeout(() => {
                    var columnDefs: any = this.getStaticColumns();
                    this.reportGrid.api.setColumnDefs([]);
                    this.reportGrid.api.setColumnDefs(columnDefs);
                }, 1);

                this.reportData = success.data;
            }
        ))
    }

    private initializeClassForms() {
        //For date range
        var today = new Date();

        this.reportDateRangeFormGroup = this.formBuilder.group({
            start: new FormControl(new Date(today.setMonth(today.getMonth() - 1))),
            end: new FormControl(new Date())
        });
    }

    //! PRIVATE Methods END
}
