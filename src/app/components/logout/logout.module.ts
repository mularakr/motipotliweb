import { NgModule } from '@angular/core';
import { LogoutComponent } from "app/components/logout/logout.component";
import { logoutRouter } from './logout.router';

@NgModule({
  declarations: [ 
    LogoutComponent ],
  imports: [ logoutRouter ]
})

export class LogoutModule {}