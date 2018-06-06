import { Component } from '@angular/core';
import { SpinnerService } from './spinner.service';
@Component({
	selector: 'spinner-component',
	'template': '<div *ngIf="active" class="spinner loderPage text-center"><div class="cssloader"><div class="sh1"></div><div class="sh2"></div></div></div>'
})
export class SpinnerComponent {
	public active: boolean;

	public constructor(spinner: SpinnerService) {
		spinner.status.subscribe((status: boolean) => {
			this.active = status;
		});
	}
}