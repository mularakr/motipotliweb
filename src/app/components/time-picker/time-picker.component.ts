import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Component, AfterViewInit, Input, Output, EventEmitter, OnInit, KeyValueDiffers, KeyValueChangeRecord } from '@angular/core';
import { FormGroup } from '@angular/forms';
//import Utils from '../../../utils/utils';
import { DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { Shared, SharedModel } from '../services/shared.service';
@Component({
    selector: 'app-time-picker',
    templateUrl: './time-picker.component.html'
})
export class TimePickerComponent implements OnInit, DoCheck {

    @Input() title: string;
    @Output() timeSelected: EventEmitter<number> = new EventEmitter<number>();

    time: string;
    _defaultTime: Date;
    ngbTimeStruct: NgbTimeStruct;
    isCollapsed = true;
    differ: any;

    constructor(private sharedservice: Shared, private differs: KeyValueDiffers) {
        this.differ = differs.find({}).create(null);
    }

    @Input()
    set defaultTime(value: Date) {
        this._defaultTime = value;

        if (!this._defaultTime) {
            let currentDate = new Date();
            this._defaultTime = currentDate;
        }

        this.ngbTimeStruct = {
            hour: this._defaultTime.getHours(),
            minute: this._defaultTime.getMinutes(),
            second: this._defaultTime.getSeconds()
        }

        this.setTime(this.ngbTimeStruct);
    }

    showTimePopup() {
        this.isCollapsed = !this.isCollapsed;
        if (this.ngbTimeStruct && this.isCollapsed) {
            this.setTime(this.ngbTimeStruct);
        }
    }

    ngOnInit() {

        if (!this._defaultTime) {
            let currentDate = new Date();
            this._defaultTime = currentDate;
        }

        this.ngbTimeStruct = {
            hour: this._defaultTime.getHours(),
            minute: this._defaultTime.getMinutes(),
            second: this._defaultTime.getSeconds()
        }

        this.setTime(this.ngbTimeStruct);
    }
    ngDoCheck() {
    }
    meridian = true;

    toggleMeridian() {
        this.meridian = !this.meridian;
    }

    setTime(timeObj): void {
        if (!timeObj) {
            return;
        }

        const minute: string = timeObj.minute.toString();
        const second: string = timeObj.second.toString();
        let m = timeObj.hour >= 12 ? 'PM' : 'AM';
        const h = timeObj.hour > 12 ? (timeObj.hour % 12) : (timeObj.hour == 0 ? 12 : timeObj.hour);
        const hour: string = h.toString();

        const time: string = (hour.length <= 1 ? '0' + hour : hour)
            + ':' + (minute.length <= 1 ? '0' + minute : minute)
            + ' ' + m;

        this.time = time;

        this._defaultTime.setHours(timeObj.hour, timeObj.minute, timeObj.second, 0);

        this.timeSelected.emit(this._defaultTime.getTime());
    }

    onClickedOutside(e) {
        if (!this.isCollapsed) {
            this.isCollapsed = true;
            this.setTime(this.ngbTimeStruct);
        }
    }
}