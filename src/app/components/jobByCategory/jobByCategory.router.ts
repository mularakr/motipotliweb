import { Routes, RouterModule } from '@angular/router';
import { JobByCategoryComponent } from "../jobByCategory/jobByCategory.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: JobByCategoryComponent
    }
];

export const jobByCategoryRouter = RouterModule.forChild(ABOUT_ROUTER);