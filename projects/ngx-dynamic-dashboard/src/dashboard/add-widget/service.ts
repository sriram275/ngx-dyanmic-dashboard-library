/**
 * Created by jayhamilton on 2/7/17.
 */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WidgetLibraryResponse} from './widgetLibraryResponse';

@Injectable({providedIn: 'root'})
export class AddWidgetService {
    constructor(private _http: HttpClient) {
    }

    getWidgetLibrary() {
        // TODO: make this configurable. the application need to define this.
        const widgetLibraryJson = 'widget-library-model.json';
        return this._http.get<WidgetLibraryResponse>('/assets/api/' + widgetLibraryJson);
    }
}
