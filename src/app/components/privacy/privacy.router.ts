import { Routes, RouterModule } from '@angular/router';
import { PrivacyPoliciesComponent } from "../privacy/privacy.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: PrivacyPoliciesComponent
    }
];

export const privacyPoliciesRouter = RouterModule.forChild(ABOUT_ROUTER);