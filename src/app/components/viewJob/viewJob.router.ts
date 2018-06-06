import { Routes, RouterModule } from '@angular/router';
import { ViewJobComponent } from "app/components/viewJob/viewJob.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: ViewJobComponent
    }
];

export const viewJobRouter = RouterModule.forChild(ABOUT_ROUTER);