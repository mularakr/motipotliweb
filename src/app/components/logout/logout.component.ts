import { Component, Input, Output, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserServices } from '../register/services/user.service';
import { User } from '../register/models/user';
import { ViewChild, ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { HostListener } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SpinnerService } from '../spinner/spinner.service';
import { Shared, SharedModel } from '../services/shared.service';
import { environment } from "../../../environments/environment";
@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html',
	providers: [UserServices],
})
export class LogoutComponent implements OnInit {

	userId: any;
	logoutMsg: any;
	access_token: any;
	dologin: boolean = false;
	logoutUrl: any;
	notification_token: any;
	logOutUrl: any;
	constructor(private sharedservice: Shared, private cookieService: CookieService, private router: Router, private userServices: UserServices, private spinner: SpinnerService) {
		this.logOutUrl = environment.logoutUrl;
	}

	ngOnInit() {
		this.userId = this.cookieService.get('userId');
		this.access_token = this.cookieService.get('access_token');
		this.notification_token = this.cookieService.get('notificationToken');

		if (!this.userId) {
			this.cookieService.deleteAll('/');
			this.dologin = false;
			this.router.navigate(['']);

		} else {
			this.logout(this.userId, this.access_token, this.notification_token);
			let cookieLifeSpan = new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate());
			this.cookieService.deleteAll('/');
			this.dologin = false;
		}
	}

	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};

	/**
	 * Logout user details
	 */
	logout(id: any, access_token: any, notificationToken: any) {
		this.spinner.start();
		this.userServices.logOutUser(id, access_token, notificationToken)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
				} else {
					this.cookieService.deleteAll('/');
					if (data['status'] == 'success') {
						this.spinner.stop();
						this.logoutMsg = data['message'];
						this.sharedservice.IsUserLoggedIn.next('null');
						window.location.assign(this.logOutUrl);
					} else {
						this.spinner.stop();
						this.logoutMsg = data['message'];
						this.sharedservice.IsUserLoggedIn.next('null');
						window.location.assign(this.logOutUrl);
					}
				}
			},
			error => {
				// console.log(error);
			});
	}
}
