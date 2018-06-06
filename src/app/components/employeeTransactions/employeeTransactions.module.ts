import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeTransactionsComponent } from "app/components/employeeTransactions/employeeTransactions.component";
import { employeeTransactionsRouter } from './employeeTransactions.router';
import { NgxPaginationModule } from 'ngx-pagination';
import { TimePickerModule } from '../time-picker/time-picker.module';
import { MyDatePickerModule } from 'mydatepicker'; //https://github.com/kekeh/mydatepicker
@NgModule({
	declarations: [
		EmployeeTransactionsComponent],
	imports: [
		employeeTransactionsRouter,
		FormsModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		MyDatePickerModule,
		TimePickerModule,
		CommonModule,
	]
})

export class EmployeeTransactionsModule { }