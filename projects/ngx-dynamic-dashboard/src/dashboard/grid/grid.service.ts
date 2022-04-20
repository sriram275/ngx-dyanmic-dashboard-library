/**
 * Created by jayhamilton on 1/28/17.
 */
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Board} from './Board';

/**
 * todo - the name of this service does not represent the file name. This should be refactored. Consider moving this service to the widget module instead.
 */

@Injectable()
export class WidgetInstanceService {

    private concreteWidgetInstances: any[] = [];
    private model: Board;
    private subject: Subject<string> = new Subject<string>();
    private subscribers: Array<Subject<string>> = [];

    constructor() {
    }

    addInstance(widget: any) {
        const widgetFound = this.concreteWidgetInstances.findIndex((instance) => {
            return widget.instanceId === instance['instance']['instanceId'];
        }) >= 0;
        if (widgetFound === false) {
            this.concreteWidgetInstances.push(widget);

        }
    }

    enableConfigureMode() {

        this.concreteWidgetInstances.forEach(function (widget) {
            widget.instance.toggleConfigMode();
        });
    }

    removeInstance(id: number) {

        console.log('REMOVING GADGET');
        // remove instance representation from model
        this.model.rows.forEach(function (row) {
            row.columns.forEach(function (column) {
                if (column.widgets) {
                    for (let i = column.widgets.length - 1; i >= 0; i--) {

                        if (column.widgets[i].instanceId === id) {

                            column.widgets.splice(i, 1);

                            break;
                        }
                    }
                }
            });
        });

        // removes concrete instance from service
        for (let x = this.concreteWidgetInstances.length - 1; x >= 0; x--) {

            if (this.concreteWidgetInstances[x].instance.instanceId === id) {

                const _widget = this.concreteWidgetInstances.splice(x, 1);

                _widget[0].destroy();

                break;
            }
        }

        // raise an event indicating a widget was removed
        this.subject.next('widget id: ' + id);
    }

    getInstanceCount() {
        return this.concreteWidgetInstances.length;
    }

    /*
     this allows this service to update the board when a delete operation occurs
     */
    setCurrentModel(model: any) {
        this.model = model;
    }

    /*
     raise an event that the grid.component is listening for when a widget is removed.
     */
    listenForInstanceRemovedEventsFromWidgets(): Observable<string> {
        return this.subject.asObservable();
    }

    addSubscriber(subscriber: any) {
        this.subscribers.push(subscriber);
    }

    unSubscribeAll() {

        this.subscribers.forEach(subscription => {
            subscription.unsubscribe();
        });

        this.subscribers.length = 0;
        this.clearAllInstances();

    }

    clearAllInstances() {

        this.concreteWidgetInstances.length = 0;
    }

}
