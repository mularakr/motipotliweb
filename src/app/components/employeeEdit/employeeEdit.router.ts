import { Routes, RouterModule } from '@angular/router';
import { EmployeeEditComponent } from "app/components/employeeEdit/employeeEdit.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: EmployeeEditComponent
    }
];

export const employeeEditRouter = RouterModule.forChild(ABOUT_ROUTER);