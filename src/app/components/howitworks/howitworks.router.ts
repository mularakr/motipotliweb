import { Routes, RouterModule } from '@angular/router';
import { HowItWorksComponent } from "../howitworks/howitworks.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: HowItWorksComponent
    }
];

export const howitworksRouter = RouterModule.forChild(ABOUT_ROUTER);