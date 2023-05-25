// Angular Imports
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CooperationWorkOrderOperationsDialogComponent } from '../cooperation-work-order-operations-dialog/cooperation-work-order-operations-dialog.component';
import { CooperationWorkOrderOperationsDialogModule } from '../cooperation-work-order-operations-dialog/cooperation-work-order-operations-dialog.module';
import { SharedUiComponentsModule } from '../../../../Truster.Core.UI.SharedUIComponents/shared-ui-components.module';
import { TranslationModule } from '../../../../Truster.Core.UI.Translation/translation.module';

// This Module's Components
import { CooperationOrderComponent } from './cooperation-order.component';
import { CooperationOrderActivePositionsDialogComponent } from './cooperation-order-active-positions-dialog/cooperation-order-active-positions-dialog.component';
import { CooperationOrderActivePositionsDialogModule } from './cooperation-order-active-positions-dialog/cooperation-order-active-positions-dialog.module';
import { CooperationOrderPositionPricesDialogModule } from './cooperation-order-position-prices-dialog/cooperation-order-position-prices-dialog.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedUiComponentsModule,
        TranslationModule,
        CooperationWorkOrderOperationsDialogModule,
        CooperationOrderActivePositionsDialogModule,
        CooperationOrderPositionPricesDialogModule
    ],
    declarations: [
        CooperationOrderComponent,
    ],
    exports: [
        CooperationOrderComponent,
    ]
})
export class CooperationOrderModule {

}
