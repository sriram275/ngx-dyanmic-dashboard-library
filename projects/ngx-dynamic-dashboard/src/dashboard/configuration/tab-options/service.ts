import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';


@Injectable()
export class OptionsService {

    optionsCollectionName = 'dashboardOptions';
    defaultOptions = {
        'enableHover': false,
        'displayWidgetOptionsInSideBar': false
    };

    private globalOptionsChangeEventSubject: Subject<any> = new Subject<any>();

    constructor() {
    }

    public getBoardOptions() {

        let databaseOptions = JSON.parse(localStorage.getItem(this.optionsCollectionName));

        if (databaseOptions == null) {
            this.persistDefautBoardOptions();
            return this.defaultOptions;
        } else {
            return databaseOptions;
        }
    }

    public setBoardOptions(options: any) {

        /**
         * Todo this will need to change to support the update to individual options. Currently there is only one
         * option but once there is more than one this method must change to take the input and update just that
         * property of the options object.
         */

        localStorage.removeItem(this.optionsCollectionName);

        /**
         *  Raise an event to listeners, primarily the widgets, when the global options change. The listeners can use
         * the event to change their behavior
         */
        this.globalOptionsChangeEventSubject.next(options);

        return localStorage.setItem(this.optionsCollectionName, JSON.stringify(options));

    }

    /**
     * The widget-base can use this method to subscribe to events that are created when the global options change.
     */
    listenForGlobalOptionsChanges(): Observable<string> {
        return this.globalOptionsChangeEventSubject.asObservable();
    }

    private persistDefautBoardOptions() {

        localStorage.setItem(this.optionsCollectionName, JSON.stringify(this.defaultOptions))

    }
}
