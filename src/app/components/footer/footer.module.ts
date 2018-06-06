import { NgModule } from '@angular/core';
import { FooterComponent } from "app/components/footer/footer.component";
import { footerRouter } from './footer.router';

@NgModule({
	declarations: [
		//FooterComponent 
	],
	imports: [footerRouter]
})

export class FooterModule { }