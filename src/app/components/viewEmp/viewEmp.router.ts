import { Routes, RouterModule } from '@angular/router';
import { ViewEmpComponent } from "./viewEmp.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: ViewEmpComponent
    }
];

export const viewEmpRouter = RouterModule.forChild(ABOUT_ROUTER);