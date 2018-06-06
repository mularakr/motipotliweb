import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from "app/components/forgotPassword/forgotPassword.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: ForgotPasswordComponent
    }
];

export const forgotPasswordRouter = RouterModule.forChild(ABOUT_ROUTER);