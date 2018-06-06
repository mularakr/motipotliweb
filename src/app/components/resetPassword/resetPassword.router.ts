import { Routes, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from "app/components/resetPassword/resetPassword.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: ResetPasswordComponent
    }
];

export const resetPasswordRouter = RouterModule.forChild(ABOUT_ROUTER);