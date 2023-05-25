import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, RowNode, GridApi } from 'ag-grid-community';
import { IBusyConfig } from 'ng-busy';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthenticationRepository } from '../../../../../Truster.Core.UI.Authentication/repositories/authentication.repository';
import { DocumentStatusCodeEnum } from '../../../../../Truster.Core.UI.CodeTable/helpers/document-status-code-enum';
import { ManufacturingService } from '../../../../../Truster.Core.UI.Manufacturing/services/manufacturing.service';
import { ScreensFactory } from '../../../../../Truster.Core.UI.Permission/factories/screens.factory';
import { PermissionRepository } from '../../../../../Truster.Core.UI.Permission/repositories/permission.repository';
import { AgGridBaseComponent } from '../../../../../Truster.Core.UI.SharedUIComponents/ag-grid/ag-grid-base/ag-grid-base.component';
import { ConfirmationDialogComponent } from '../../../../../Truster.Core.UI.SharedUIComponents/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ResultCodeEnum } from '../../../../../Truster.Core.UI.SharedUIComponents/helpers/result.code.enum';
import { PermissionTypeService } from '../../../../../Truster.Core.UI.SharedUIComponents/interfaces/permission.type.service';
import { ScreenTypeService } from '../../../../../Truster.Core.UI.SharedUIComponents/interfaces/screen.type.service';
import { BusyConfigFactory } from '../../../../../Truster.Core.UI.SharedUIComponents/loading-spinner/busy.config.factory';
import { DatePipeProxy } from '../../../../../Truster.Core.UI.SharedUIComponents/pipes/date.pipe.proxy';
import { AgGridService } from '../../../../../Truster.Core.UI.SharedUIComponents/services/ag-grid.service';
import { SnackbarService } from '../../../../../Truster.Core.UI.SharedUIComponents/services/snackbar.service';
import { TranslationFactory } from '../../../../../Truster.Core.UI.Translation/factories/translation.factory';
import { GetCooperationTakeoverPositionRequest } from '../../../../commands/requests/get.cooperation.takeover.position.request';
import { PostCooperationOrderTakeoverPositionCancelRequest } from '../../../../commands/requests/post.cooperation.order.takeover.position.cancel.request';
import { CooperationOrderStatusEnumStrings } from '../../../../helpers/cooperation-order-status-enum-strings';
import { CooperationTakeoverPositionData } from '../../../../helpers/cooperation-takeover-position-data';
import { ProcurementService } from '../../../../services/procurement.service';

@Component({
  selector: 'app-cooperation-takeover-positions-dialog',
  templateUrl: './cooperation-takeover-positions-dialog.component.html',
  styleUrls: ['./cooperation-takeover-positions-dialog.component.scss']
})

export class CooperationTakeoverPositionsDialogComponent extends AgGridBaseComponent implements OnInit, OnDestroy {

  @ViewChild('takeoverPositionsGrid', { static: true }) takeoverPositionsGrid: AgGridAngular;

  dialogRef = null;
  dialogData: any = null;
  dialogTitle: string;

  //Subscriptions
  loadingBusy: IBusyConfig = BusyConfigFactory.create();

  takeoverPositionsData: CooperationTakeoverPositionData[] = [];
  cooperationTakeoverId: number;

  /*  takeoverPositionsGridOptions START */
  takeoverPositionsGridOptions: GridOptions = {
    localeText: this._localeText,
    animateRows: false,
    defaultColDef: {
      width: 200,
      editable: false,
      resizable: true,
      sortable: true
    },
    rowSelection: "multiple",
    editType: "fullRow",
    suppressColumnVirtualisation: true,
    suppressClipboardPaste: true,
    suppressCopyRowsToClipboard: true,
    accentedSort: true,
    tabToNextCell: this.tabToNextCell.bind(this),
    enableCellChangeFlash: true,
    sideBar: {
      toolPanels: [
        {
          id: "columns",
          labelDefault: this.translateService.instant("FORMS.FIELDS.columns"),
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
          toolPanelParams: {
            suppressRows: true,
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
  /* takeoverPositionsGridOptions END */

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

    this.dialogTitle = this.translateService.instant("SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.takeover_positions") + " " + this.dialogData.code;
    this.cooperationTakeoverId = this.dialogData.recordId;
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

    //Check permissions
    this.checkUIPermissions("purchaseCooperationOrder", "purchaseCooperationOrderManagement");

    //Load data to grid
    var getCooperationTakeoverPositionRequest = new GetCooperationTakeoverPositionRequest();
    getCooperationTakeoverPositionRequest.cooperationTakeoverId = this.cooperationTakeoverId;

    this.getCooperationTakeoverPositionData(getCooperationTakeoverPositionRequest);
  }

  //!  Angular Functions END 


  //! PUBLIC Methods START

  //Closes dialog
  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  //Builds menu when user right clicks on row in grid
  getTakeoverPositionsContextMenuItems(params) {

    var result = [];
    var context: CooperationTakeoverPositionsDialogComponent = params.context;
    var rowData = params.node?.data;
    var rowNode: RowNode = params.node;
    var gridApi: GridApi = params.api;
    var copy = "copy";
    var separator = "separator";

    var exportExcel = {
      name: context.translateService.instant("FORMS.FIELDS.exportExcel"),
      action: function () {
        params.api.exportDataAsExcel();
      },
      icon: "<span class='fa fa-file-excel-o'></span>"
    };

    var cancelTakeoverAction = {
      name: context.translateService.instant("SCREEN.WORKORDERS.storno"),
      action: function () {
        //Confirmation dialog
        let dialogRef = context.dialog.open(ConfirmationDialogComponent, {
          height: 'auto',
          width: '40%'
        });

        context.translateService.get(['SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.cancel_position_action_title', 'DATA.yes', 'DATA.no', 'SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.cancel_position_action_text']).subscribe((tResult: string) => {
          dialogRef.componentInstance.actionCancel = tResult["DATA.no"];
          dialogRef.componentInstance.actionYes = tResult["DATA.yes"];
          dialogRef.componentInstance.dialogText = tResult["SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.cancel_position_action_text"];
          dialogRef.componentInstance.dialogTitle = tResult["SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.cancel_position_action_title"];
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result && result === 'ok') {
            if (rowNode.data) {
              //remove from server
              var request: PostCooperationOrderTakeoverPositionCancelRequest = new PostCooperationOrderTakeoverPositionCancelRequest();
              request.cooperationTakeoverPositionId = rowData.recordId;

              context.loadingBusy.busy.push(context.procurementService.cancelCooperationOrderTakeoverPosition(request).subscribe(
                {
                  next: () => {
                    //Refresh client data
                    //Load data to grid
                    var getCooperationTakeoverPositionRequest = new GetCooperationTakeoverPositionRequest();
                    getCooperationTakeoverPositionRequest.cooperationTakeoverId = context.cooperationTakeoverId;
                    context.getCooperationTakeoverPositionData(getCooperationTakeoverPositionRequest);
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
          }
        })
      },
      icon: "<span class='fas fa-ban '></span>"
    };

    if (params && params.node) {
      if (context.hasReadWritePermissions) {
        if (rowData.status == CooperationOrderStatusEnumStrings.active || rowData.status == CooperationOrderStatusEnumStrings.completed) {
          result.push(cancelTakeoverAction);
          result.push(separator);
        }
      }

      result.push(copy);
      result.push(exportExcel);
    }

    return result;
  }

  //Serch data in grid
  onSearch(params) {
    this.takeoverPositionsGrid.api.setQuickFilter(params.target.value);
  }

  //! PUBLIC METHODS END 

  //! PRIVATE Methods START

  //Takes care about ag-grid columns
  private getStaticColumns() {
    var columnns =
      [
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
            newRowsAction: 'keep'
          },
          headerValueGetter: this.localizeHeader.bind(this),
        },
        {
          headerName: "SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.workOrderOperationCode",
          field: "workOrderOperationCode",
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
          headerName: "SCREEN.PROCUREMENT.COOPERATIONTAKEOVERS.quantityTakeovered",
          field: "quantity",
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
            if (params.data.quantity) {
              return this.numberFormatter(params.data.quantity, params.context.locale);
            }
            else {
              return this.numberFormatter(0, params.context.locale);
            }
          }
        }
      ];

    return columnns;
  }

  //Returns data from server
  private getCooperationTakeoverPositionData(getCooperationTakeoverPositionRequest: GetCooperationTakeoverPositionRequest) {
    this.loadingBusy.busy.push(this.procurementService.getCooperationTakeoverPositions(getCooperationTakeoverPositionRequest).subscribe(
      (success) => {
        var columnDefs: any = this.getStaticColumns();
        this.takeoverPositionsGrid.api.setColumnDefs([]);
        this.takeoverPositionsGrid.api.setColumnDefs(columnDefs);

        this.takeoverPositionsData = success.data;
      }
    ))
  }
}