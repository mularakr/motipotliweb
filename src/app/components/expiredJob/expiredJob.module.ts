import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpiredJobComponent } from "../../components/expiredJob/expiredJob.component";
import { expiredJobRouter } from './expiredJob.router';
import { NgxPaginationModule } from 'ngx-pagination'; //http://michaelbromley.github.io/ngx-pagination/#/
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { ShareButtonsModule } from '@ngx-share/buttons'; //https://www.npmjs.com/package/ngx-sharebuttons

@NgModule({
	declarations: [
		ExpiredJobComponent],
	imports: [
		expiredJobRouter,
		CommonModule,
		FormsModule,
		NgxPaginationModule,
		ReactiveFormsModule,
		MyDateRangePickerModule,
		ShareButtonsModule
	]
})

export class ExpiredJobModule { }