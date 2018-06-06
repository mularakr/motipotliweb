import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { EditProfileComponent } from "app/components/editProfile/editProfile.component";
import { editProfileRouter } from './editProfile.router';

@NgModule({
  declarations: [ 
    EditProfileComponent ],  
  imports: [
     editProfileRouter,
     CommonModule,
     FormsModule,
     ReactiveFormsModule     
     ]
})

export class EditProfileModule {}