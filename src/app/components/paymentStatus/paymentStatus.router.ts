import { Routes, RouterModule } from '@angular/router';
import { PaymentStatusComponent } from "app/components/paymentStatus/paymentStatus.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: PaymentStatusComponent
    }
];

export const paymentStatusRouter = RouterModule.forChild(ABOUT_ROUTER);