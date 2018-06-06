import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimePickerComponent } from './time-picker.component';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
	imports: [
		CommonModule,
		HttpModule,
		FormsModule,
		ReactiveFormsModule,
		NgbTimepickerModule,
		NgbCollapseModule,
		ClickOutsideModule
	],

	declarations: [
		TimePickerComponent
	],

	providers: [],

	exports: [
		TimePickerComponent
	]
})
export class TimePickerModule {
}

