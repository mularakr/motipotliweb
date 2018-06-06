import { Routes, RouterModule } from '@angular/router';
import { GeographicalSearchComponent } from "../geographicalSearch/geographicalSearch.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: GeographicalSearchComponent
    }
];

export const geographicalSearchRouter = RouterModule.forChild(ABOUT_ROUTER);