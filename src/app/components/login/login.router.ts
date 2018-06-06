import { Routes, RouterModule } from '@angular/router';
import {LoginComponent } from "app/components/login/login.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: LoginComponent
    }
];
export const loginRouter = RouterModule.forChild(ABOUT_ROUTER);