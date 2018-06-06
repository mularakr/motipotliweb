import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from "app/components/changePassword/changePassword.component";
import { changePasswordRouter } from './changePassword.router';

@NgModule({
  declarations: [ 
    ChangePasswordComponent ],  
  imports: [ 
    changePasswordRouter,
    FormsModule,
    ReactiveFormsModule, 
    CommonModule
  ]
})

export class ChangePasswordModule {}