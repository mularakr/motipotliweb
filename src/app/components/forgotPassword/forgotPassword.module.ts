import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forgotPasswordRouter } from './forgotPassword.router';

@NgModule({
	declarations: [],
	imports: [
		forgotPasswordRouter,
		FormsModule,
		ReactiveFormsModule,
		CommonModule
	]
})

export class ForgotPasswordModule { }