import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactUsComponent } from "../contactUs/contactUs.component";
import { contactUsRouter } from './contactUs.router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { AgmCoreModule } from 'angular2-google-maps/core';
@NgModule({
	declarations: [
		ContactUsComponent],
	imports: [
		contactUsRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		ShareButtonsModule,
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyC7Zng3kRP4VRS9PJ4vPWpk33wQ6IQAnsU'
		})
	]
})
export class ContactUsModule { }