import { Routes, RouterModule } from '@angular/router';
import { ViewJobDetailsComponent } from "../viewJobDetails/viewJobDetails.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: ViewJobDetailsComponent
    }
];

export const ViewJobDetailsRouter = RouterModule.forChild(ABOUT_ROUTER);