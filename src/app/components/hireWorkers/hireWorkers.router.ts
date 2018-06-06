import { Routes, RouterModule } from '@angular/router';
import { HireWorkersComponent } from "../hireWorkers/hireWorkers.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: HireWorkersComponent
    }
];

export const hireWorkersRouter = RouterModule.forChild(ABOUT_ROUTER);