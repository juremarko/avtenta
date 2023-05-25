// Angular Imports
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiComponentsModule } from '../../../../../Truster.Core.UI.SharedUIComponents/shared-ui-components.module';
import { TranslationModule } from '../../../../../Truster.Core.UI.Translation/translation.module';

// This Module's Components
import { CooperationTakeoverPositionsDialogComponent } from './cooperation-takeover-positions-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiComponentsModule,
    TranslationModule
  ],
  declarations: [
    CooperationTakeoverPositionsDialogComponent,
  ],
  exports: [
    CooperationTakeoverPositionsDialogComponent,
  ]
})
export class CooperationTakeoverPositionsDialogModule {

}