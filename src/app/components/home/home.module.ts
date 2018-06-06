import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from "app/components/home/home.component";
import { OwlModule } from 'ng2-owl-carousel';
import { homeRouter } from './home.router';
import { AdsenseModule } from 'ng2-adsense';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

@NgModule({
	declarations: [HomeComponent
	],
	imports: [
		homeRouter,
		OwlModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		AngularMultiSelectModule,
		AdsenseModule.forRoot({
			adClient: 'ca-pub-2201288336602886',
			adSlot: 6270830582,
		})
	]
})

export class HomeModule { }