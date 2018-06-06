import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewEmployeeJobComponent } from "./viewEmployeeJob.component";
import { ViewEmployeeJobRouter } from './viewEmployeeJob.router';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { AdsenseModule } from 'ng2-adsense';

@NgModule({
	declarations: [
		ViewEmployeeJobComponent],
	imports: [
		ViewEmployeeJobRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ShareButtonsModule,
		AdsenseModule.forRoot({
			adClient: 'ca-pub-2201288336602886',
			adSlot: 6270830582,
		})
	]
})

export class ViewEmployeeJobModule { }