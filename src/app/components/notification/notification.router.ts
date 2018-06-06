import { Routes, RouterModule } from '@angular/router';
import { NotificationComponent } from "../notification/notification.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: NotificationComponent
    }
];

export const NotificationRouter = RouterModule.forChild(ABOUT_ROUTER);