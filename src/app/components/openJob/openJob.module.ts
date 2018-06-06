import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { OpenJobComponent } from "app/components/openJob/openJob.component";
import { openJobRouter } from './openJob.router';
import {NgxPaginationModule} from 'ngx-pagination'; //http://michaelbromley.github.io/ngx-pagination/#/
import { MyDateRangePickerModule } from 'mydaterangepicker';
//import {HttpModule} from '@angular/http'
import { ShareButtonsModule } from '@ngx-share/buttons'; //https://www.npmjs.com/package/ngx-sharebuttons

@NgModule({
  declarations: [ 
    OpenJobComponent],
  imports: [ 
    openJobRouter,
	CommonModule,
  FormsModule,
  NgxPaginationModule,
  ReactiveFormsModule,
  MyDateRangePickerModule,
  ShareButtonsModule
 // HttpModule,  
      ]
})

export class OpenJobModule {}