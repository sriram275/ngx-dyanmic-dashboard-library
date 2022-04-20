import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WidgetHeaderComponent} from './widget-header-component';
import {WidgetOperationComponent} from './widget-operation-control-component';
import {HelpModalComponent} from './help-modal-component';
import {VisDrillDownComponent} from './vis-drill-down-component';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
    imports: [
        CommonModule,
        MatProgressBarModule,
    ],
    declarations: [
        WidgetHeaderComponent,
        WidgetOperationComponent,
        HelpModalComponent,
        VisDrillDownComponent
    ],
    exports: [
        WidgetHeaderComponent,
        WidgetOperationComponent,
        HelpModalComponent,
        VisDrillDownComponent
    ]
})
export class WidgetSharedModule {
}
