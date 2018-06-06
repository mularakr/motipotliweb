import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { otpVerificationRouter } from './otpVerification.router';

@NgModule({
	declarations: [
	],
	imports: [
		otpVerificationRouter,
		FormsModule,
		ReactiveFormsModule,
		CommonModule
	]
})

export class OtpVerificationModule { }