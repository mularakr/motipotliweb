import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgbdDatepickerPopup } from "app/components/datepick/datepick.component";
import { datepickRouter } from './datepick.router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
@NgModule({
	declarations: [NgbdDatepickerPopup],
	imports: [datepickRouter,
		FormsModule,
		NgbModule.forRoot()
	]
})

export class DatepickModule {
}