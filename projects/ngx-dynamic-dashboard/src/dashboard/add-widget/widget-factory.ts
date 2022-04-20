/**
 * Created by jayhamilton on 6/30/17.
 */
// @ts-ignore
import {Type} from '@angular/core';
import { NewsWidgetComponent } from '../widgets/news/news-widget.component';
import { TasksWidgetComponent } from '../widgets/tasks/tasks-widget.component';
import {TodoWidgetComponent} from '../widgets/todo/todo-widget.component';

export class WidgetFactory {

    static componentMap = new Map();

    static getComponentType(widgetType: string): Type<any> {
        console.log("in factory", widgetType);
        switch(widgetType){
            case 'TodoWidgetComponent':
                return TodoWidgetComponent;
            case 'NewsWidgetComponent':
                return NewsWidgetComponent;
            case 'TasksWidgetComponent':
                return TasksWidgetComponent;
            default:
                return WidgetFactory.componentMap.get(widgetType);
        }
    }

    static setComponentType(widgetType: string, componentRef: Type<any>): void {
        WidgetFactory.componentMap.set(widgetType, componentRef);
    }
}
