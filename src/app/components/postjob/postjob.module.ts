import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PostjobComponent } from "app/components/postjob/postjob.component";
import { postjobRouter } from './postjob.router';
//import { NgbdDatepickerPopup } from '../datepick/datepick.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimePickerModule } from '../time-picker/time-picker.module';
import { MyDatePickerModule } from 'mydatepicker'; //https://github.com/kekeh/mydatepicker

@NgModule({
  declarations: [ 
    PostjobComponent 
   // NgbdDatepickerPopup
  ],
  imports: [ 
	postjobRouter,
	CommonModule,
	FormsModule,
  ReactiveFormsModule,
  MyDatePickerModule,
  TimePickerModule,  
  NgbModule.forRoot()
      ]
})

export class PostjobModule {}