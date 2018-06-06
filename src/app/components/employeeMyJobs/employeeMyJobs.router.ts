import { Routes, RouterModule } from '@angular/router';
import { EmployeeMyJobsComponent } from "../employeeMyJobs/employeeMyJobs.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: EmployeeMyJobsComponent
    }
];

export const employeeMyJobsRouter = RouterModule.forChild(ABOUT_ROUTER);