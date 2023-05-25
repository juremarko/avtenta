// Angular Imports
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiComponentsModule } from '../../../../../Truster.Core.UI.SharedUIComponents/shared-ui-components.module';
import { TranslationModule } from '../../../../../Truster.Core.UI.Translation/translation.module';

// This Module's Components
import { CooperationIssuePositionsDialogComponent } from './cooperation-issue-positions-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiComponentsModule,
    TranslationModule
  ],
  declarations: [
    CooperationIssuePositionsDialogComponent,
  ],
  exports: [
    CooperationIssuePositionsDialogComponent,
  ]
})
export class CooperationIssuePositionsDialogModule {

}