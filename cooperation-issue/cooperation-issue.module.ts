// Angular Imports
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiComponentsModule } from '../../../../Truster.Core.UI.SharedUIComponents/shared-ui-components.module';
import { TranslationModule } from '../../../../Truster.Core.UI.Translation/translation.module';

// This Module's Components
import { CooperationIssueComponent } from './cooperation-issue.component';
import { CooperationIssuePositionsDialogComponent } from './cooperation-issue-positions-dialog/cooperation-issue-positions-dialog.component';
import { CooperationIssuePositionsDialogModule } from './cooperation-issue-positions-dialog/cooperation-issue-positions-dialog.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedUiComponentsModule,
        TranslationModule,
        CooperationIssuePositionsDialogModule
    ],
    declarations: [
        CooperationIssueComponent,
    ],
    exports: [
        CooperationIssueComponent,
    ]
})
export class CooperationIssueModule {

}


