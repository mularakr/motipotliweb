import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MakePaymentComponent } from "../makePayment/makePayment.component";
import { makePaymentRouter } from './makePayment.router';

@NgModule({
	declarations: [
		MakePaymentComponent],
	imports: [
		makePaymentRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,]
})

export class MakePaymentModule { }