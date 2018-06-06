import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserActivationComponent } from "app/components/userActivation/userActivation.component";
import { userActivationRouter } from './userActivation.router';

@NgModule({
	declarations: [
		UserActivationComponent],
	imports: [
		userActivationRouter,
		FormsModule,
		ReactiveFormsModule,
		CommonModule
	]
})

export class UserActivationModule { }