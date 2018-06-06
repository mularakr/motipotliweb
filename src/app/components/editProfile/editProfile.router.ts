import { Routes, RouterModule } from '@angular/router';
import { EditProfileComponent } from "app/components/editProfile/editProfile.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: EditProfileComponent
    }
];

export const editProfileRouter = RouterModule.forChild(ABOUT_ROUTER);