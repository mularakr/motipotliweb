import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployerTransactionsComponent } from "app/components/employerTransactions/employerTransactions.component";
import { employerTransactionsRouter } from './employerTransactions.router';
import { NgxPaginationModule } from 'ngx-pagination';
import { TimePickerModule } from '../time-picker/time-picker.module';
import { MyDatePickerModule } from 'mydatepicker'; //https://github.com/kekeh/mydatepicker
@NgModule({
	declarations: [
		EmployerTransactionsComponent],
	imports: [
		employerTransactionsRouter,
		FormsModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		MyDatePickerModule,
		TimePickerModule,
		CommonModule,
	]
})

export class EmployerTransactionsModule { }