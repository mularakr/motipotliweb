import { Routes, RouterModule } from '@angular/router';
import { NewJobContentComponent } from "../newJobContent/newJobContent.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: NewJobContentComponent
    }
];

export const newJobContentRouter = RouterModule.forChild(ABOUT_ROUTER);