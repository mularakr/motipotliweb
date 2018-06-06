import { Routes, RouterModule } from '@angular/router';
import { EmployeeTransactionsComponent } from "app/components/employeeTransactions/employeeTransactions.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: EmployeeTransactionsComponent
    }
];

export const employeeTransactionsRouter = RouterModule.forChild(ABOUT_ROUTER);