import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationComponent } from "./notification.component";
import { NotificationRouter } from './notification.router';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
	declarations: [
		NotificationComponent],
	imports: [
		NotificationRouter,
		CommonModule,
		FormsModule,
		NgxPaginationModule,
		ReactiveFormsModule
	]
})

export class NotificationModule { }