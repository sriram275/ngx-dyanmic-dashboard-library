import {ChangeDetectorRef, Component} from '@angular/core';
import {NewsService} from './service';
import {WidgetBase} from '../_common/widget-base';
import { WidgetInstanceService } from '../../grid/grid.service';
import { WidgetPropertyService } from '../_common/widget-property.service';
import { OptionsService } from '../../configuration/tab-options/service';

@Component({
    moduleId: module.id,
    selector: 'app-dynamic-component',
    templateUrl: './view.html',
    styleUrls: ['../_common/styles-widget.css']
})
export class NewsWidgetComponent extends WidgetBase {

    // runtime document subscription
    news: any;
    resource: string;

    widgetHasOperationControls = false;
    constructor(
                protected _widgetInstanceService: WidgetInstanceService,
                protected _propertyService: WidgetPropertyService,
                protected _changeDetectionRef: ChangeDetectorRef,
                protected _newsService: NewsService,
                protected _optionsService: OptionsService
                ) {
        super(
            _widgetInstanceService,
            _propertyService,
            _changeDetectionRef,
            _optionsService);
    }

    public preRun(): void {
        this.updateData(null);
        this.run();
    }

    public run() {
        this.news = [];
        this.initializeRunState(true);
        this.updateData(null);
    }

    public stop() {
        this.setStopState(false);
    }

    public updateData(data: any[]) {

        this._newsService.get().subscribe(news => {
                this.news = news;
            },
            error => this.handleError(error));
    }

    public updateProperties(updatedProperties: any) {

        /**
         * todo
         *  A similar operation exists on the procmman-config-service
         *  whenever the property page form is saved, the in memory board model
         *  is updated as well as the widget instance properties
         *  which is what the code below does. This can be eliminated with code added to the
         *  config service or the property page service.
         *
         * **/

        const updatedPropsObject = JSON.parse(updatedProperties);

        this.propertyPages.forEach((propertyPage) => {


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
