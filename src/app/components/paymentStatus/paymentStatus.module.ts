import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentStatusComponent } from "app/components/paymentStatus/paymentStatus.component";
import { paymentStatusRouter } from './paymentStatus.router';

@NgModule({
	declarations: [
		PaymentStatusComponent],
	imports: [
		paymentStatusRouter,
		FormsModule,
		ReactiveFormsModule,
		CommonModule
	]
})

export class PaymentStatusModule { }