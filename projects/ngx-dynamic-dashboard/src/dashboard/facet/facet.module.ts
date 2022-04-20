import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FacetComponent} from './facet-component';
import {FilterListComponent} from './filter-list-component';
import {FilterTagComponent} from './filter-tag-component';
import {CapitalizeFirstPipe} from './capitalize-first-character-pipe';
import {FormsModule} from '@angular/forms';
import {AddWidgetService} from '../add-widget/service';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatCheckboxModule
    ],
    declarations: [
        FacetComponent,
        FilterListComponent,
        FilterTagComponent,
        CapitalizeFirstPipe
    ],
    providers: [
        AddWidgetService
    ],
    exports: [
        FacetComponent,
        FilterListComponent,
        FilterTagComponent,
        CapitalizeFirstPipe
    ]
})
export class FacetModule {
}
