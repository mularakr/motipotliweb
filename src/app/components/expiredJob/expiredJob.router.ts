import { Routes, RouterModule } from '@angular/router';
import { ExpiredJobComponent } from "../../components/expiredJob/expiredJob.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: ExpiredJobComponent
    }
];

export const expiredJobRouter = RouterModule.forChild(ABOUT_ROUTER);