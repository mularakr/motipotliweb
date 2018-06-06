import { Routes, RouterModule } from '@angular/router';
import { OtpVerificationComponent } from "../otpVerification/otpVerification.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: OtpVerificationComponent
    }
];

export const otpVerificationRouter = RouterModule.forChild(ABOUT_ROUTER);