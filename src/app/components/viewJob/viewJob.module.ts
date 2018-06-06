import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewJobComponent } from "app/components/viewJob/viewJob.component";
import { viewJobRouter } from './viewJob.router';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { AdsenseModule } from 'ng2-adsense';

@NgModule({
	declarations: [
		ViewJobComponent],
	imports: [
		viewJobRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ShareButtonsModule,
		AdsenseModule.forRoot({
			adClient: 'ca-pub-2201288336602886',
			adSlot: 6270830582,
		}),
	]
})

export class ViewJobModule { }