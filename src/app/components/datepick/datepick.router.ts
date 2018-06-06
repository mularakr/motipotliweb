import { Routes, RouterModule } from '@angular/router';
import { NgbdDatepickerPopup } from "app/components/datepick/datepick.component";

const DATEPICK_ROUTER: Routes = [
    { 
        path: '',
        component: NgbdDatepickerPopup
    }
];

export const datepickRouter = RouterModule.forChild(DATEPICK_ROUTER);