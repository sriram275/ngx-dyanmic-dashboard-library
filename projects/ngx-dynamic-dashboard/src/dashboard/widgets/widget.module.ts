import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DynamicFormModule } from "../dynamic-form/dynamic-form-module";
import { ErrorHandlerModule } from "../error/error.module";
import { NewsWidgetComponent } from "./news/news-widget.component";
import { NewsService } from "./news/service";
import { TasksService } from "./tasks/service";
import { TasksWidgetComponent } from "./tasks/tasks-widget.component";
import { TodoService } from "./todo/service";
import { TodoWidgetComponent } from "./todo/todo-widget.component";
import { WidgetSharedModule } from "./_common/widget-shared.module";

@NgModule({
    imports: [
        CommonModule,
        WidgetSharedModule,
        DynamicFormModule,
        ErrorHandlerModule,
        FormsModule
    ],
    declarations: [
        TodoWidgetComponent,
        NewsWidgetComponent,
        TasksWidgetComponent
    ],
    providers: [
        TodoService,
        NewsService,
        TasksService
      ],
    exports: [
        TodoWidgetComponent,
        NewsWidgetComponent,
        TasksWidgetComponent
    ]
})
export class WidgetModule{

}