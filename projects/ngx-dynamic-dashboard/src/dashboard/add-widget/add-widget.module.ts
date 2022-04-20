import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AddWidgetComponent} from './add-widget-component';
import {AddWidgetService} from './service';
import {HttpClientModule} from '@angular/common/http';
import {DataListModule} from '../datalist/data-list.module';

@NgModule({
    imports: [
        CommonModule,
        DataListModule,
        HttpClientModule
    ],
    declarations: [
        AddWidgetComponent
    ],
    providers: [
        AddWidgetService
    ],
    exports: [
        AddWidgetComponent
    ]
})
export class AddWidgetModule {
}

