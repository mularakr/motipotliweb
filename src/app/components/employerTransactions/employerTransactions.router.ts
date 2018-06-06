import { Routes, RouterModule } from '@angular/router';
import { EmployerTransactionsComponent } from "app/components/employerTransactions/employerTransactions.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: EmployerTransactionsComponent
    }
];

export const employerTransactionsRouter = RouterModule.forChild(ABOUT_ROUTER);