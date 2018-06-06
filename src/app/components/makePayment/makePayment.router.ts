import { Routes, RouterModule } from '@angular/router';
import { MakePaymentComponent } from "../makePayment/makePayment.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: MakePaymentComponent
    }
];

export const makePaymentRouter = RouterModule.forChild(ABOUT_ROUTER);