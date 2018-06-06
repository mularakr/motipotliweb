import { Routes, RouterModule } from '@angular/router';
import { FooterComponent } from "app/components/footer/footer.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: FooterComponent
    }
];

export const footerRouter = RouterModule.forChild(ABOUT_ROUTER);