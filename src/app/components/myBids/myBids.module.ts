import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyBidsComponent } from "../myBids/myBids.component";
import { MyBidsRouter } from './myBids.router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { AdsenseModule } from 'ng2-adsense';

@NgModule({
	declarations: [
		MyBidsComponent],
	imports: [
		MyBidsRouter,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		ShareButtonsModule,
		MyDateRangePickerModule,
		AdsenseModule.forRoot({
			adClient: 'ca-pub-2201288336602886',
			adSlot: 6270830582,
		})

	]
})

export class MyBidsModule { }