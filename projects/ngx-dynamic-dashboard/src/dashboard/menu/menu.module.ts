import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfigurationModule} from '../configuration/configuration.module';
import {LayoutModule} from '../layout/layout.module';
import {AddWidgetModule} from '../add-widget/add-widget.module';
// import {NotificationModule} from '../notification/notification.module';
import {ConfigurationService} from '../services/configuration.service';
import {RuntimeService} from '../services/runtime.service';
import {ObservableWebSocketService} from '../services/websocket-service';
import {TypeAheadInputModule} from '../typeahead-input/typeahead-input.module';
import {MenuComponent} from './menu.component';
import {MenuEventService} from './menu-service';
// import {AboutModule} from '../about/about.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {WidgetPropertyService} from '../widgets/_common/widget-property.service';
import { WidgetModule } from '../widgets/widget.module';

@NgModule({
    imports: [
        CommonModule,
        AddWidgetModule,
        LayoutModule,
        ConfigurationModule,
        TypeAheadInputModule,
        MatButtonModule,
        MatIconModule,
        WidgetModule
    ],
    providers: [
        RuntimeService,
        ConfigurationService,
        WidgetPropertyService,
        ObservableWebSocketService,
        MenuEventService
    ],
    declarations: [
        MenuComponent
    ],
    exports: [
        MenuComponent
    ]
})
export class MenuModule {
}
