// Angular Imports
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiComponentsModule } from '../../../../Truster.Core.UI.SharedUIComponents/shared-ui-components.module';
import { TranslationModule } from '../../../../Truster.Core.UI.Translation/translation.module';
import { CooperationTakeoverPositionsDialogComponent } from './cooperation-takeover-positions-dialog/cooperation-takeover-positions-dialog.component';
import { CooperationTakeoverPositionsDialogModule } from './cooperation-takeover-positions-dialog/cooperation-takeover-positions-dialog.module';

// This Module's Components
import { CooperationTakeoverComponent } from './cooperation-takeover.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedUiComponentsModule,
        TranslationModule,
        CooperationTakeoverPositionsDialogModule
    ],
    declarations: [
        CooperationTakeoverComponent,
    ],
    exports: [
        CooperationTakeoverComponent,
    ]
})
export class CooperationTakeoverModule {

}

