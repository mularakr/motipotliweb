import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HowItWorksComponent } from "../howitworks/howitworks.component";
import { howitworksRouter } from './howitworks.router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShareButtonsModule } from '@ngx-share/buttons';
@NgModule({
	declarations: [
		HowItWorksComponent],
	imports: [
		howitworksRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		ShareButtonsModule
	]
})

export class HowItWorksModule { }