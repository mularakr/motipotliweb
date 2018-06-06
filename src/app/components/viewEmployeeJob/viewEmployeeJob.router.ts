import { Routes, RouterModule } from '@angular/router';
import { ViewEmployeeJobComponent } from "../viewEmployeeJob/viewEmployeeJob.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: ViewEmployeeJobComponent
    }
];

export const ViewEmployeeJobRouter = RouterModule.forChild(ABOUT_ROUTER);