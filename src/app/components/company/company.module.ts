import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyComponent } from "../company/company.component";
import { companyRouter } from './company.router';

@NgModule({
	declarations: [
		CompanyComponent],
	imports: [
		companyRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,]
})

export class CompanyModule { }