import {ANALYZE_FOR_ENTRY_COMPONENTS, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ToastModule} from '../toast/toast.module';
import {GridComponent} from './grid.component';
import {CellComponent} from './cell.component';
import {WidgetInstanceService} from './grid.service';
import {ConfigurationService} from '../services/configuration.service';
import {AddWidgetService} from '../add-widget/service';

import {DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ToastModule,
        HttpClientModule,
        DragDropModule
    ],
    declarations: [
        GridComponent,
        CellComponent
    ],
    exports: [
        GridComponent
    ],
    providers: [
        WidgetInstanceService,
        ConfigurationService,
        AddWidgetService
    ]
})
export class GridModule {
    static withComponents(components: any[]) {
        return {
            ngModule: GridModule,
            providers: [
                {provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: components, multi: true}
            ]
        };
    }
}
