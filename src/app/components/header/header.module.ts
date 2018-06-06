import { NgModule } from '@angular/core';
import { HeaderComponent } from "app/components/header/header.component";
import { headerRouter } from './header.router';
import { ShareButtonsModule } from '@ngx-share/buttons';
@NgModule({
	declarations: [
	],
	imports: [headerRouter, ShareButtonsModule]
})

export class HeaderModule { }