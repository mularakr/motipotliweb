import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeEditComponent } from "app/components/employeeEdit/employeeEdit.component";
import { employeeEditRouter } from './employeeEdit.router';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
@NgModule({
	declarations: [
		EmployeeEditComponent],
	imports: [
		employeeEditRouter,
		CommonModule,
		FormsModule,
		AngularMultiSelectModule,
		ReactiveFormsModule
	]
})

export class EmployeeEditModule { }