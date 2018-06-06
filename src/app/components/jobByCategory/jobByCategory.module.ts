import { Component, ViewChild, ElementRef, Input, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobByCategoryComponent } from "../jobByCategory/jobByCategory.component";
import { jobByCategoryRouter } from './jobByCategory.router';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
	declarations: [
		JobByCategoryComponent,
	],
	imports: [
		jobByCategoryRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxPaginationModule
	]
})

export class JobByCategoryModule { }