import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeographicalSearchComponent } from "../geographicalSearch/geographicalSearch.component";
import { geographicalSearchRouter } from './geographicalSearch.router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShareButtonsModule } from '@ngx-share/buttons';
@NgModule({
	declarations: [
		GeographicalSearchComponent],
	imports: [
		geographicalSearchRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		ShareButtonsModule
	]
})

export class GeographicalSearchModule { }