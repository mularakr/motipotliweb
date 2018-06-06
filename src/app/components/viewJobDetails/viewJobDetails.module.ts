import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ViewJobDetailsComponent } from "./viewJobDetails.component";
import { ViewJobDetailsRouter } from './viewJobDetails.router';
import { AdsenseModule } from 'ng2-adsense';

@NgModule({
  declarations: [ 
    ViewJobDetailsComponent],
  imports: [ 
    ViewJobDetailsRouter,
	CommonModule,
	FormsModule,
  ReactiveFormsModule,
  AdsenseModule.forRoot({
      adClient: 'ca-pub-2201288336602886',
      adSlot: 6270830582,
    }),
      ]
})

export class ViewJobDetailsModule {}