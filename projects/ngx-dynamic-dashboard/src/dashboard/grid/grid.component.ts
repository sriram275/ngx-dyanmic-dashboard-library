import {Component, EventEmitter, Input, Output} from '@angular/core';
import {WidgetInstanceService} from './grid.service';
import {ConfigurationService} from '../services/configuration.service';
import {WidgetConfigModel} from '../widgets/_common/widget-config-model';
import {AddWidgetService} from '../add-widget/service';
import {ToastService} from '../toast/toast.service';
import {MenuEventService} from '../menu/menu-service';
import {IEvent} from '../menu/IEvent';
import {Column, Board} from './Board';


@Component({
    moduleId: module.id,
    selector: 'dashboard-grid',
    templateUrl: './grid.html',
    styleUrls: ['./styles-grid.css']
})
export class GridComponent {

    @Output() boardUpdateEvent: EventEmitter<any> = new EventEmitter();

    model: Board = <any>{};
    noWidgets = true;
    dashedStyle: {};
    dropZone1: any = null;
    dropZone2: any = null;
    dropZone3: any = null;

    widgetLibrary: any[] = [];

    private boards: Board[];

    /** todo
     * Temporary objects for experimenting with AI
     * @type
     */

    gridInsertionPosition = {
        x: 0,
        y: 0
    };

    /**
     * Todo - split model and board operations. This class should really focus on an individual board model's operations
     * within the grid. The board specific operations should be moved to the board component.
     * @param _widgetInstanceService
     * @param _procmonConfigurationService
     */

    constructor(private _widgetInstanceService: WidgetInstanceService,
                private _configurationService: ConfigurationService,
                private _widgetLibraryService: AddWidgetService,
                private _toastService: ToastService,
                private _menuEventService: MenuEventService) {


        this.removeOldListeners();
        this.setupEventListeners();
        this.initializeBoard();
        this.getWidgetLibrary();

    }

    /**
     * todo - This is a temporary attempt to avoid emitting events from stale listeners.
     * Most severe symptom is when you drill down and then change the layout.
     * Multiple events are triggered per action due to the services not
     * getting destroyed when coming into the main board from a child route. The end result is multiple widget instances
     * appearing. The following code improves the condition but there still are issues with multiple widgets appearing
     * when changing the layout.
     *
     */
    removeOldListeners() {

        this._widgetInstanceService.unSubscribeAll();
        this._menuEventService.unSubscribeAll();

    }

    setupEventListeners() {

        const widgetRemoveEventSubscriber = this._widgetInstanceService
            .listenForInstanceRemovedEventsFromWidgets().subscribe((message: string) => {
                this.saveBoard('Widget Removed From Board: ' + message, false);
        });


        const menuEventSubscriber = this._menuEventService.listenForMenuEvents().subscribe((event: IEvent) => {
            const edata = event['data'];

            switch (event['name']) {
                case 'boardChangeLayoutEvent':
                    this.updateBoardLayout(edata);
                    break;
                case 'boardSelectEvent':
                    this.loadBoard(edata);
                    break;
                case 'boardCreateEvent':
                    this.createBoard(edata);
                    break;
                case 'boardEditEvent':
                    this.editBoard(edata);
                    break;
                case 'boardDeleteEvent':
                    this.deleteBoard(edata);
                    break;
                case 'boardAddWidgetEvent':
                    this.addWidget(edata);
                    break;
                case 'boardAIAddWidgetEvent':
                    this.addWidgetUsingArtificialIntelligence(edata);
                    break;
            }
        });

        this._widgetInstanceService.addSubscriber(widgetRemoveEventSubscriber);
        this._menuEventService.addSubscriber(menuEventSubscriber);

    }

    /**
     *
     * This is experimental code that deals with AI
     */
    getWidgetLibrary() {

        this._widgetLibraryService.getWidgetLibrary().subscribe(data => {
            this.widgetLibrary.length = 0;
            const me = this;
            data.library.forEach(function (item) {
                me.widgetLibrary.push(item);
            });
        });
    }

    getWidgetFromLibrary(widgetType: string) {

        let widgetObject = null;
        this.widgetLibrary.forEach(widget => {


            if (widgetType.localeCompare(widget['componentType']) === 0) {

                widgetObject = widget;
            }
        });
        console.log("widgetObject",widgetObject)
        return widgetObject;
    }

    addWidgetUsingArtificialIntelligence(aiObject: any) {

        /** todo
         * make confidence code configurable
         */
        if (aiObject && aiObject.operation) {
            switch (aiObject.operation) {
                case 'get_storage':
                    this.addWidget(this.getWidgetFromLibrary('StorageObjectListComponent'));
                    break;
                case 'get_cpu':
                    this.addWidget(this.getWidgetFromLibrary('CPUWidgetComponent'));
                    break;
            }
        }
    }

    /**
     * This is the end of the experimental AI code.
     */

    updateWidgetPositionInBoard($event, columnNumber, rowNumber, type) {

        console.log($event['item']['data']);
        console.log(columnNumber + ' ' + rowNumber);

        let moveComplete = false;

        this.getModel().rows.forEach(row => {

            let colpos = 0;

            row.columns.forEach(column => {

                let widgetpos = 0;

                if (column.widgets) {

                    column.widgets.forEach(_widget => {

                        if (_widget.instanceId === $event['item']['data'] && !moveComplete) {

                            const widget = column.widgets.splice(widgetpos, 1);


                            if (!this.getModel().rows[rowNumber].columns[columnNumber].widgets) {
                                this.getModel().rows[rowNumber].columns[columnNumber].widgets = [];
                            }
                            this.getModel().rows[rowNumber].columns[columnNumber].widgets.push(widget[0]);
                            this.saveBoard('drag drop operation', false);
                            moveComplete = true;
                        }
                        widgetpos++;
                    });
                    colpos++;
                }
            });
        });
    }

    public createBoard(name: string) {
        this.loadNewBoard(name);
    }

    public editBoard(name: string) {

    }

    public deleteBoard(name: string) {

        this._configurationService.deleteBoard(name).subscribe(data => {

                this.initializeBoard();

            },
            error => console.error('Deletion error', error),
            () => console.debug('Board Deletion: ' + name));

    }

    public addWidget(widget: any) {
        const _widget = Object.assign({}, widget);

        _widget.instanceId = new Date().getTime();
        _widget.config = new WidgetConfigModel(widget.config);

        this.setWidgetInsertPosition();

        const x = this.gridInsertionPosition.x;
        const y = this.gridInsertionPosition.y;

        if (!this.getModel().rows[x].columns[y].widgets) {

            this.getModel().rows[x].columns[y].widgets = [];
        }
        this.getModel().rows[x].columns[y].widgets.push(_widget);

        this.saveBoard('Adding Widget To The Board', false);

    }

    public updateBoardLayout(structure) {

        console.log('IN UPDATE BOARD LAYOUT');

        // user selected the currently selected layout
        if (structure.id === this.getModel().id) {
            return;
        }

        // copy the current board's model
        const _model = Object.assign({}, this.getModel());

        // get just the columns that contain widgets from all rows
        const originalColumns: any[] = this.readColumnsFromOriginalModel(_model);

        // reset the copied model's rows, which include columns
        _model.rows.length = 0;

        // copy the contents of the requested structure into the temporary model
        // we now have a board model we can populate with the original board's widgets
        Object.assign(_model.rows, structure.rows);
        _model.structure = structure.structure;
        _model.id = structure.id;

        let originalColumnIndexToStartProcessingFrom = 0;

        /* For each column from the original board, copy its widgets to the new structure.
         The requested layout may have more or less columns than defined by the original layout. So the fillGridStructure method
         will copy column content into the target. If there are more columns than the target,
         the fillGridStructure will return the count of remaining columns to be processed and then process those.
         */
        while (originalColumnIndexToStartProcessingFrom < originalColumns.length) {
            originalColumnIndexToStartProcessingFrom = this.fillGridStructure(
                _model,
                originalColumns,
                originalColumnIndexToStartProcessingFrom);
        }

        // This will copy the just processed model and present it to the board
        this.setModel(_model);

        // clear temporary object
        for (const member in _model) {
            delete _model[member];
        }

        // persist the board change
        this.saveBoard('Grid Layout Update', false);
    }

    public enableConfigMode() {

        this._widgetInstanceService.enableConfigureMode();
    }

    public setModel(model: Board) {

        this.model = Object.assign({}, model);
    }

    public getModel() {
        return this.model;
    }

    public onDrop(data) {
        console.log(data);
    }

    private updateGridState() {

        let widgetCount = 0;

        if (this.getModel().rows) {
            this.getModel().rows.forEach(function (row) {
                row.columns.forEach(function (column) {
                    if (column.widgets) {
                        column.widgets.forEach(function (widget) {
                            widgetCount++;
                        });
                    }
                });
            });
        }

        this.noWidgets = !widgetCount;

        this.dashedStyle = {
            'border-style': this.noWidgets ? 'dashed' : 'none',
            'border-width': this.noWidgets ? '2px' : 'none',
            'border-color': this.noWidgets ? 'darkgray' : 'none',
            'padding': this.noWidgets ? '5px' : 'none'
        };
    }

    private readColumnsFromOriginalModel(_model) {

        const columns = [];
        _model.rows.forEach(function (row) {
            row.columns.forEach(function (col) {
                columns.push(col);
            });
        });
        return columns;

    }

    private fillGridStructure(destinationModelStructure, originalColumns: Column[], counter: number) {

        const me = this;

        destinationModelStructure.rows.forEach(function (row) {
            row.columns.forEach(function (destinationColumn) {
                if (!destinationColumn.widgets) {
                    destinationColumn.widgets = [];
                }
                if (originalColumns[counter]) {
                    me.copyWidgets(originalColumns[counter], destinationColumn);
                    counter++;
                }
            });
        });

        return counter;

    }

    private copyWidgets(source, target) {

        if (source.widgets && source.widgets.length > 0) {
            let w = source.widgets.shift();
            while (w) {
                target.widgets.push(w);
                w = source.widgets.shift();
            }
        }
    }

    private initializeBoard() {

        this._configurationService.getBoards().subscribe(boards => {
            if (boards && boards instanceof Array && boards.length) {
                this.boards = boards.sort((a, b) => {
                    return a.boardInstanceId - b.boardInstanceId;
                });

                this.loadBoard(this.boards[0].title);
            } else {
                this.loadDefaultBoard();
            }
        });
    }

    private loadBoard(boardTitle: string) {
        this.clearGridModelAndWidgetInstanceStructures();
        const selectedBoard = this.boards.find(board => board.title === boardTitle);
        this.setModel(selectedBoard);
        this.updateServicesAndGridWithModel();
        this.boardUpdateEvent.emit(boardTitle);
    }

    private loadDefaultBoard() {

        this.clearGridModelAndWidgetInstanceStructures();

        this._configurationService.getDefaultBoard().subscribe((board: Board) => {

            this.setModel(board);
            this.updateServicesAndGridWithModel();
            this.saveBoard('Initialization of a default board', true);
        });
    }

    private loadNewBoard(name: string) {

        this.clearGridModelAndWidgetInstanceStructures();

        this._configurationService.getDefaultBoard().subscribe((res: Board) => {

            this.setModel(res);
            this.getModel().title = name;
            this.getModel().boardInstanceId = new Date().getTime();

            this.updateServicesAndGridWithModel();
            this.saveBoard('Initialization of a new board', true);


        });
    }

    private updateServicesAndGridWithModel() {
        this._widgetInstanceService.setCurrentModel(this.getModel());
        this._configurationService.setCurrentModel(this.getModel());
        this.updateGridState();
    }

    private saveBoard(operation: string, alertBoardListenerThatTheMenuShouldBeUpdated: boolean) {

        this.updateServicesAndGridWithModel();

        this._configurationService.saveBoard(this.getModel()).subscribe(result => {

                this._toastService.sendMessage(this.getModel().title + ' has been updated!', '');

                if (alertBoardListenerThatTheMenuShouldBeUpdated) {
                    this._menuEventService.raiseGridEvent({name: 'boardUpdateEvent', data: this.getModel().title});
                }
            },
            error => console.error('Error' + error),
            () => console.debug('Saving configuration to store!'));

    }

    private clearGridModelAndWidgetInstanceStructures() {
// clear widgetInstances
        this._widgetInstanceService.clearAllInstances();
// clear current model
        for (const prop in this.getModel()) {
            if (this.model.hasOwnProperty(prop)) {
                delete this.model[prop];
            }
        }
    }

    private setWidgetInsertPosition() {

        for (let x = 0; x < this.getModel().rows.length; x++) {

            for (let y = 0; y < this.getModel().rows[x].columns.length; y++) {

                if (this.getModel().rows[x].columns[y].widgets && this.getModel().rows[x].columns[y].widgets.length === 0) {

                    this.gridInsertionPosition.x = x;
                    this.gridInsertionPosition.y = y;
                    return;

                }
            }
        }
// we go here because the board is either empty or full
// insert in the top left most cell
        this.gridInsertionPosition.y = 0;

        if (this.noWidgets) {
            // there are no widgets so insert in top row
            this.gridInsertionPosition.x = 0;
        } else {
            // board is full so insert in the last row
            this.gridInsertionPosition.x = this.getModel().rows.length - 1;
        }
    }

}
