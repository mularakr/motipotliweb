import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutComponent } from "../about/about.component";
import { aboutRouter } from './about.router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShareButtonsModule } from '@ngx-share/buttons';
@NgModule({
	declarations: [
		AboutComponent],
	imports: [
		aboutRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		ShareButtonsModule
	]
})

export class AboutModule { }