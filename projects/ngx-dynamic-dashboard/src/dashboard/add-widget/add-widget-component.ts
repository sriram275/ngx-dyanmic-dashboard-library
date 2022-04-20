/**
 * Created by jayhamilton on 1/24/17.
 */
import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';

import {animate, style, transition, trigger} from '@angular/animations';

import {AddWidgetService} from './service';
import {Facet} from '../facet/facet-model';
import {FacetTagProcessor} from '../facet/facet-tag-processor';

declare var jQuery: any;

/**
 * Message Modal - clasable modal with message
 *
 * Selector message-modal
 *
 * Methods
 *      popMessageModal - display a message modal for a sepcified duration
 *      showMessageModal - show the message modal
 *      hideMessageModal - hide the message modal
 */
@Component({
    selector: 'dashboard-add-widget-modal',
    moduleId: module.id,
    templateUrl: './view.html',
    styleUrls: ['./styles.css'],
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
export class AddWidgetComponent implements AfterViewInit {

    @Output() addWidgetEvent: EventEmitter<any> = new EventEmitter();

    widgetObjectList: any[] = [];
    widgetObjectTitleList: string[] = [];
    placeHolderText = 'Begin typing widget name';
    layoutColumnOneWidth = 'six';
    layoutColumnTwoWidth = 'ten';
    listHeader = 'Widgets';
    facetTags: Array<Facet>;

    color = 'white';

    typeAheadIsInMenu = false;

    modalicon: string;
    modalheader: string;
    modalmessage: string;

    @ViewChild('messagemodal_tag', {static: true}) messagemodalRef: ElementRef;

    messageModal: any;

    constructor(private _addWidgetService: AddWidgetService) {

        this.getObjectList();
    }

    actionHandler(actionItem, actionName) {
        console.log("action Items",actionItem);
        this.addWidgetEvent.emit(actionItem);
        this.hideMessageModal();

    }


    showMessageModal(icon: string, header: string, message: string) {
        this.modalicon = icon;
        this.modalheader = header;
        this.modalmessage = message;
        this.messageModal.modal('show');

    }

    showComponentLibraryModal(header: string) {

        this.modalheader = header;
        this.messageModal.modal('show');
    }

    hideMessageModal() {
        this.modalicon = '';
        this.modalheader = '';
        this.modalmessage = '';
        this.messageModal.modal('hide');
    }

    ngAfterViewInit() {
        this.messageModal = jQuery(this.messagemodalRef.nativeElement);
    }

    getObjectList() {

        this._addWidgetService.getWidgetLibrary().subscribe(data => {
            this.widgetObjectList.length = 0;
            const me = this;
            data.library.forEach(function (item) {

                me.widgetObjectList.push(item);
                me.widgetObjectTitleList.push(item.name);
            });
            const facetTagProcess = new FacetTagProcessor(this.widgetObjectList);
            this.facetTags = facetTagProcess.getFacetTags();
        });

    }
}
