import { Routes, RouterModule } from '@angular/router';
import { UserActivationComponent } from "app/components/userActivation/userActivation.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: UserActivationComponent
    }
];

export const userActivationRouter = RouterModule.forChild(ABOUT_ROUTER);