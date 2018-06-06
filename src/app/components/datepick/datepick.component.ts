import { Component, AfterViewInit, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Shared, SharedModel } from '../services/shared.service';
import { Meta } from '@angular/platform-browser';

const now = new Date();
@Component({
	selector: 'ngbd-datepicker-popup',
	templateUrl: './datepick.component.html',
})
export class NgbdDatepickerPopup implements OnInit {

	@Input() model: any;
	@Input() model2: any;


	@Output() onDatePicked: EventEmitter<any> = new EventEmitter();

	/**
	* constructor
	* this is called by the JavaScript engine
	* rather than Angular
	* dependencies we require 
	*/
	constructor(private sharedservice: Shared, private meta: Meta) {
		this.meta.addTags([{ name: 'about-us', content: 'component to display datepicker functionalities.' }]);
	}

	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() { }

	/**
	 * Respond after Angular initializes the component's views and child views
	 */
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};
	date(event, type: any) {
		var startdate = event.year + "-" + event.month + "-" + event.day;
		this.onDatePicked.emit({ startdate: startdate, dateType: type })
	}

	/**
	* privent Char  value
	*/
	checkNumeric(event: any) {

		const pattern = /[0-9\+\-\ ]/;
		let inputChar = String.fromCharCode(event.charCode);

		if (!pattern.test(inputChar) && event.charCode != '0') {
			event.preventDefault();
		}
	}
}

