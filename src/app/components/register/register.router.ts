import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from "app/components/register/register.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: RegisterComponent
    }
];

export const registerRouter = RouterModule.forChild(ABOUT_ROUTER);