import { Component } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';
import { SpinnerService } from './components/spinner/spinner.service';
import { otpVerificationService } from './components/otpVerification/otpVerification.service';
import { CookieService } from 'ngx-cookie-service';
import { MessagingService } from "./components/messaging/messaging.service";
import { ContentServices } from './components/services/content.service';
import { Shared, SharedModel } from './components/services/shared.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [SpinnerService, ContentServices],
})
export class AppComponent {
	title = 'app works!';
	isLogin = false;
	load: boolean;
	loading: any;
	constructor(private router: Router, private spinner: SpinnerService, private cookieService: CookieService, private otpService: otpVerificationService, private messagingService: MessagingService, private contentServices: ContentServices, private sharedservice: Shared) {
		router.events.subscribe((event: RouterEvent) => {
			this.navigationInterceptor(event)
		})

	}

	public ngOnInit() {
		this.messagingService.receiveMessage();
	}

	// Shows and hides the loading spinner during RouterEvent changes
	navigationInterceptor(event: RouterEvent): void {
		if (event instanceof NavigationStart) {
			let currentUrl = event.url.split('/');
			currentUrl = currentUrl.filter((e) => { return e });
			if (currentUrl.length == 0 || currentUrl[0] == 'geographicalSearch' ||
				currentUrl[0] == 'viewJobDetails' || currentUrl[0] == 'contactUs' ||
				currentUrl[0] == 'newJobContent' || currentUrl[0] == 'hireWorkers') {
				this.getAboutUsDetails();
			}
			this.spinner.start();
			window.scrollTo(0, 0);
			let pop: any = this.cookieService.get('otp_status');
			if (pop == '1') {
				this.otpService.openPop();
			} else {
				this.otpService.closePop();
			}
		}

		if (event instanceof NavigationEnd) {
			this.spinner.stop();
			window.scrollTo(0, 0);
		}

	}

	/**
	 * get user details by id
	 * @param: userId
	 * @type:string
	 */
	getAboutUsDetails() {
		this.contentServices.getAboutUsPageDetails()
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					let about: string = data['data']['about'];
					let contact: string = data['data']['contact'];
					localStorage.setItem('about', about['content']); //about content
					localStorage.setItem('contact', contact['content']); //contact content
					this.sharedservice.changedHederContent.next('true');
				}
			},
			error => {
				// console.log(error);				
			});
	}
}
