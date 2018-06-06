import { Routes, RouterModule } from '@angular/router';
import { PostjobComponent } from "app/components/postjob/postjob.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: PostjobComponent
    }
];

export const postjobRouter = RouterModule.forChild(ABOUT_ROUTER);