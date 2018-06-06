import { Routes, RouterModule } from '@angular/router';
import {LogoutComponent } from "app/components/logout/logout.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: LogoutComponent
    }
];

export const logoutRouter = RouterModule.forChild(ABOUT_ROUTER);