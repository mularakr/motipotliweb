import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from "app/components/resetPassword/resetPassword.component";
import { resetPasswordRouter } from './resetPassword.router';

@NgModule({
	declarations: [
		ResetPasswordComponent],
	imports: [
		resetPasswordRouter,
		FormsModule,
		ReactiveFormsModule,
		CommonModule
	]
})

export class ResetPasswordModule { }