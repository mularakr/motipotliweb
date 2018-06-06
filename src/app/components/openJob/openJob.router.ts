import { Routes, RouterModule } from '@angular/router';
import { OpenJobComponent } from "app/components/openJob/openJob.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: OpenJobComponent
    }
];

export const openJobRouter = RouterModule.forChild(ABOUT_ROUTER);