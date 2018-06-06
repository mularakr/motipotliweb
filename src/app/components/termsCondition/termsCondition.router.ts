import { Routes, RouterModule } from '@angular/router';
import { TermsConditionComponent } from "../termsCondition/termsCondition.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: TermsConditionComponent
    }
];

export const TermsConditionRouter = RouterModule.forChild(ABOUT_ROUTER);