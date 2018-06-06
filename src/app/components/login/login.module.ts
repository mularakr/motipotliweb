import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from "app/components/login/login.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { loginRouter } from './login.router';
import { CommonModule } from '@angular/common';
@NgModule({
	declarations: [
	],
	imports: [loginRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule, NgbModule.forRoot()
	]
})

export class LoginModule { }