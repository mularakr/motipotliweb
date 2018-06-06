import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchEmployeeJobsComponent } from "../searchEmployeeJobs/searchEmployeeJobs.component";
import { SearchEmployeeJobsRouter } from './searchEmployeeJobs.router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { TimePickerModule } from '../time-picker/time-picker.module';
import { MyDatePickerModule } from 'mydatepicker'; //https://github.com/kekeh/mydatepicker
import { AdsenseModule } from 'ng2-adsense';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

@NgModule({
	declarations: [
		SearchEmployeeJobsComponent],
	imports: [
		SearchEmployeeJobsRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		MyDatePickerModule,
		TimePickerModule,
		ShareButtonsModule,
		AngularMultiSelectModule,
		AdsenseModule.forRoot({
			adClient: 'ca-pub-2201288336602886',
			adSlot: 6270830582,
		})
	]
})

export class SearchEmployeeJobsModule { }