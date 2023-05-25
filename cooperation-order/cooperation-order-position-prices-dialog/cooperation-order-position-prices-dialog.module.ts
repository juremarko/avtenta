// Angular Imports
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiComponentsModule } from '../../../../../Truster.Core.UI.SharedUIComponents/shared-ui-components.module';
import { TranslationModule } from '../../../../../Truster.Core.UI.Translation/translation.module';

// This Module's Components
import { CooperationOrderPositionPricesDialogComponent } from './cooperation-order-position-prices-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedUiComponentsModule,
        TranslationModule
    ],
    declarations: [
        CooperationOrderPositionPricesDialogComponent,
    ],
    exports: [
        CooperationOrderPositionPricesDialogComponent,
    ]
})
export class CooperationOrderPositionPricesDialogModule {

}
