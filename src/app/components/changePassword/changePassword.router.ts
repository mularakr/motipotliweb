import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from "app/components/changePassword/changePassword.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: ChangePasswordComponent
    }
];

export const changePasswordRouter = RouterModule.forChild(ABOUT_ROUTER);