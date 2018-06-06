import { Routes, RouterModule } from '@angular/router';
import { SearchEmployeeJobsComponent } from "../searchEmployeeJobs/searchEmployeeJobs.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component:SearchEmployeeJobsComponent
    }
];

export const SearchEmployeeJobsRouter = RouterModule.forChild(ABOUT_ROUTER);