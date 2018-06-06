import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditJobComponent } from "app/components/editJob/editJob.component";
import { editJobRouter } from './editJob.router';
import { MyDatePickerModule } from 'mydatepicker';
import { TimePickerModule } from '../time-picker/time-picker.module';
@NgModule({
	declarations: [
		EditJobComponent
	],
	imports: [
		editJobRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MyDatePickerModule,
		TimePickerModule,
	]
})

export class EditJobModule { }