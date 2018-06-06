import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TermsConditionComponent } from "../termsCondition/termsCondition.component";
import { TermsConditionRouter } from './termsCondition.router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShareButtonsModule } from '@ngx-share/buttons';
@NgModule({
	declarations: [
		TermsConditionComponent],
	imports: [
		TermsConditionRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		ShareButtonsModule
	]
})

export class TermsConditionModule { }