import { Routes, RouterModule } from '@angular/router';
import { BookedJobComponent } from "app/components/bookedJob/bookedJob.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: BookedJobComponent
    }
];

export const bookedJobRouter = RouterModule.forChild(ABOUT_ROUTER);