/**
 * Created by jayhamilton on 1/24/17.
 */
import {Component} from '@angular/core';
import {OptionsService} from './service';
import {ToastService} from '../../toast/toast.service';

@Component({
    selector: 'dashboard-options-config-tab',
    moduleId: module.id,
    templateUrl: './view.html',
    styleUrls: ['./styles.css']
})
export class OptionsConfigurationTabComponent {

    enableHover: boolean;
    displayWidgetOptionsInSideBar: boolean;

    constructor(private _optionsService: OptionsService, private _toastService: ToastService) {

        this.enableHover = this._optionsService.getBoardOptions()['enableHover'];
        this.displayWidgetOptionsInSideBar = this._optionsService.getBoardOptions()['displayWidgetOptionsInSideBar'];
    }

    onHooverOptionChange(value) {

        this._optionsService.setBoardOptions(
            {
                'enableHover': value['checked'],
                'displayWidgetOptionsInSideBar': this.displayWidgetOptionsInSideBar

            });
        this._toastService.sendMessage('The board configuration has changed!', null);
    }

    onDisplayWidgetOptionsInSideBarChange(value) {

        this._optionsService.setBoardOptions({
            'enableHover': this.enableHover,
            'displayWidgetOptionsInSideBar': value['checked']

        });
        this._toastService.sendMessage('The board configuration has changed!', null);

    }

}
