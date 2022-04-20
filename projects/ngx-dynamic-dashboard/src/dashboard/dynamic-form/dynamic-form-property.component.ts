/**
 * Created by jayhamilton on 2/5/17.
 */
import {AfterViewInit, Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {PropertyBase} from './property-base';

import {animate, style, transition, trigger} from '@angular/animations';

@Component({
    moduleId: module.id,
    selector: 'dashboard-df-property',
    templateUrl: './dynamic-form-property.component.html',
    styleUrls: ['./styles-props.css'],
    animations: [

        trigger(
            'showHideAnimation',
            [
                transition(':enter', [   // :enter is alias to 'void => *'
                    style({opacity: 0}),
                    animate(750, style({opacity: 1}))
                ]),
                transition(':leave', [   // :leave is alias to '* => void'
                    animate(750, style({opacity: 0}))
                ])
            ])
    ]
})
export class DynamicFormPropertyComponent implements AfterViewInit {
    @Input() property: PropertyBase<any>;
    @Input() form: FormGroup;
    @Input() widgetTags: any[];//todo - use to control what endpoints are displayed
    endPoints: string[] = [];

    constructor() {

        this.updateEndPointList();
    }

    get isValid() {

        return this.form.controls[this.property.key].valid;
    }

    updateEndPointList() {
        /*
        this.endPointService.getEndPoints().subscribe(data => {

            this.endPoints = data['endPoint'].slice();

        });
         */
    }

    ngAfterViewInit() {

        //filter endpoints based on the widgets tags

        let me = this;
        let eligibleEndpoints = [];

        this.endPoints.forEach(function (point, index, object) {

            let found = false;
            point['tags'].forEach(tag => {

                me.widgetTags.forEach(_gt => {

                    if (_gt.name.trim().toLowerCase() === tag.name.trim().toLowerCase()) {
                        found = true;
                    }
                })
            });

            if (found) {
                eligibleEndpoints.push(point);
            }
        });

        this.endPoints = eligibleEndpoints.slice();

    }
}
