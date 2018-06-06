import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrivacyPoliciesComponent } from "../privacy/privacy.component";
import { privacyPoliciesRouter } from './privacy.router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShareButtonsModule } from '@ngx-share/buttons';
@NgModule({
	declarations: [
		PrivacyPoliciesComponent],
	imports: [
		privacyPoliciesRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		ShareButtonsModule
	]
})

export class PrivacyPoliciesModule { }