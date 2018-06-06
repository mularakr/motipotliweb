import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookedJobComponent } from "app/components/bookedJob/bookedJob.component";
import { bookedJobRouter } from './bookedJob.router';
import { NgxPaginationModule } from 'ngx-pagination';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { AdsenseModule } from 'ng2-adsense';

@NgModule({
	declarations: [
		BookedJobComponent],
	imports: [
		bookedJobRouter,
		CommonModule,
		FormsModule,
		NgxPaginationModule,
		ReactiveFormsModule,
		MyDateRangePickerModule,
		ShareButtonsModule,
		AdsenseModule.forRoot({
			adClient: 'ca-pub-2201288336602886',
			adSlot: 6270830582,
		})
	]
})

export class BookedJobModule { }