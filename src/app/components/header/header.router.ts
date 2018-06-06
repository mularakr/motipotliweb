import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from "app/components/header/header.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: HeaderComponent
    }
];

export const headerRouter = RouterModule.forChild(ABOUT_ROUTER);