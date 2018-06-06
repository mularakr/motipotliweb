import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from "../faq/faq.component";

const ABOUT_ROUTER: Routes = [
    { 
        path: '',
        component: FaqComponent
    }
];

export const faqRouter = RouterModule.forChild(ABOUT_ROUTER);