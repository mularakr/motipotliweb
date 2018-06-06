import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewEmpComponent } from "./viewEmp.component";
import { viewEmpRouter } from './viewEmp.router';
@NgModule({
	declarations: [
		ViewEmpComponent],
	imports: [
		viewEmpRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule
	]
})

export class ViewEmpModule { }