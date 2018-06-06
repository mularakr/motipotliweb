import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HireWorkersComponent } from "../hireWorkers/hireWorkers.component";
import { hireWorkersRouter } from './hireWorkers.router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShareButtonsModule } from '@ngx-share/buttons';
@NgModule({
	declarations: [
		HireWorkersComponent],
	imports: [
		hireWorkersRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		ShareButtonsModule
	]
})

export class HireWorkersModule { }