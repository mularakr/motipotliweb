import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeMyJobsComponent } from "../employeeMyJobs/employeeMyJobs.component";
import { employeeMyJobsRouter } from './employeeMyJobs.router';
import { NgxPaginationModule } from 'ngx-pagination';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { ShareButtonsModule } from '@ngx-share/buttons';
@NgModule({
	declarations: [
		EmployeeMyJobsComponent],
	imports: [
		employeeMyJobsRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		MyDateRangePickerModule,
		ShareButtonsModule
	]
})

export class EmployeeMyJobsModule { }