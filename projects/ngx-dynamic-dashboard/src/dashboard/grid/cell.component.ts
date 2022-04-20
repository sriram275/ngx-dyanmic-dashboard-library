import {
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Input,
    OnInit, Type,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {WidgetInstanceService} from './grid.service';
import {WidgetFactory} from '../add-widget/widget-factory';
import {WidgetBase} from '../widgets/_common/widget-base';

/*
 this class handles the dynamic creation of components
 */

@Component({
    selector: 'dashboard-grid-cell',
    template: '<ng-template #container></ng-template>'
})
export class CellComponent implements OnInit {
    @Input() widgetType: string;
    @Input() widgetConfig: any;
    @Input() widgetInstanceId: number;
    @Input() widgetTags: Array<any>;

    @ViewChild('container', {static: true, read: ViewContainerRef}) viewContainerRef: ViewContainerRef;


    constructor(
        private cfr: ComponentFactoryResolver, private widgetInstanceService: WidgetInstanceService) {
    }

    ngOnInit() {
        /*
         create component instance dynamically
         */
        const component: Type<any> = WidgetFactory.getComponentType(this.widgetType);
        if (component) {
            const compFactory = this.cfr.resolveComponentFactory(component);
            const widgetRef: ComponentRef<WidgetBase> = this.viewContainerRef.createComponent(compFactory);

            /*
             we need to pass the input parameters (instance id and config) back into the newly created component.
             */
            widgetRef.instance.configureWidget(this.widgetInstanceId, this.widgetConfig, this.widgetTags);

            /*
             add concrete component to service for tracking
             */
            this.widgetInstanceService.addInstance(widgetRef);
        } else {
            console.log("No component");
        }

    }

}

