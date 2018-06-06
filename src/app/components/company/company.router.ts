import { Routes, RouterModule } from '@angular/router';
import { CompanyComponent } from "../company/company.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: CompanyComponent
    }
];

export const companyRouter = RouterModule.forChild(ABOUT_ROUTER);