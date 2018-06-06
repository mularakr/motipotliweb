import { Routes, RouterModule } from '@angular/router';
import { MyBidsComponent } from "../myBids/myBids.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component:MyBidsComponent
    }
];

export const MyBidsRouter = RouterModule.forChild(ABOUT_ROUTER);