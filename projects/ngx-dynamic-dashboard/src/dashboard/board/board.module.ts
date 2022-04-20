import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GridModule} from '../grid/grid.module';
import {BoardComponent} from './board.component';
import {MenuModule} from '../menu/menu.module';

// export const modalModuleForRoot: ModuleWithProviders<ModalModule> = ModalModule.forRoot();

@NgModule({
    imports: [
        CommonModule,
        GridModule,
        MenuModule
    ],
    providers: [],
    declarations: [
        BoardComponent
    ],
    exports: [
        BoardComponent
    ]
})
export class BoardModule {
}
