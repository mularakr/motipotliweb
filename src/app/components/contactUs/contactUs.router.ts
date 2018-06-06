import { Routes, RouterModule } from '@angular/router';
import { ContactUsComponent } from "../contactUs/contactUs.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: ContactUsComponent
    }
];

export const contactUsRouter = RouterModule.forChild(ABOUT_ROUTER);