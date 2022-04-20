import {ChangeDetectorRef, Component} from '@angular/core';
import {WidgetInstanceService} from '../../grid/grid.service';
import {WidgetPropertyService} from '../_common/widget-property.service';
import {WidgetBase} from '../_common/widget-base';
import {TasksService} from './service';
import {OptionsService} from "../../configuration/tab-options/service";  // tasks component

@Component({
    selector: 'app-dynamic-component',
    moduleId: module.id,
    templateUrl: './view.html',
    styleUrls: ['../_common/styles-widget.css']
})
export class TasksWidgetComponent extends WidgetBase {

    widgetHasOperationControls = false;

    // runtime document subscription
    data: any;
    tasks: string;
    tasksList = ['tasks 1'];

    constructor(protected _tasksService: TasksService,
                protected _widgetInstanceService: WidgetInstanceService,
                protected _propertyService: WidgetPropertyService,
                protected _changeDetectionRef: ChangeDetectorRef,
                protected _optionsService: OptionsService) {
        super(_widgetInstanceService,
            _propertyService,
            _changeDetectionRef,
            _optionsService);
    }

    public preRun(): void {
        this.run();
    }

    public run() {
        this.data = [];
        this.initializeRunState(true);
        this.updateData(null);
    }

    public stop() {
        this.setStopState(false);
    }

    public updateData(data: any[]) {

        this._tasksService.get().subscribe(_data => {
                this.data = _data;
            },
            error => this.handleError(error));
    }

    public addTasks(tasks: string) {
        this.tasksList.push(tasks);
    }

    public removeTasks(tasksIx: number) {
        if (this.tasksList.length) {
            this.tasksList.splice(tasksIx, 1);
        }
    }

    public updateProperties(updatedProperties: any) {

        /**
         * tasks
         *  A similar operation exists on the procmman-config-service
         *  whenever the property page form is saved, the in memory board model
         *  is updated as well as the widget instance properties
         *  which is what the code below does. This can be eliminated with code added to the
         *  config service or the property page service.
         *
         * **/

        const updatedPropsObject = JSON.parse(updatedProperties);

        this.propertyPages.forEach(function (propertyPage) {


            for (let x = 0; x < propertyPage.properties.length; x++) {

                for (const prop in updatedPropsObject) {
                    if (updatedPropsObject.hasOwnProperty(prop)) {
                        if (prop === propertyPage.properties[x].key) {
                            propertyPage.properties[x].value = updatedPropsObject[prop];
                        }

                    }
                }
            }
        });

        this.title = updatedPropsObject.title;
        this.setEndPoint(updatedPropsObject.endpoint);
        this.updateData(null);

    }

}
