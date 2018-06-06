import { Routes, RouterModule } from '@angular/router';
import { EditJobComponent } from "app/components/editJob/editJob.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: EditJobComponent
    }
];

export const editJobRouter = RouterModule.forChild(ABOUT_ROUTER);