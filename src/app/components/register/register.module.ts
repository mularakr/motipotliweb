import { NgModule } from '@angular/core';
import { RegisterComponent } from "app/components/register/register.component";

import { registerRouter } from './register.router';

@NgModule({
	declarations: [
	],
	imports: [registerRouter]
})

export class RegisterModule { }