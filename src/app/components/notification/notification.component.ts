import { Component, AfterViewInit, Input, Output, OnInit, trigger, state, style, ChangeDetectorRef, ChangeDetectionStrategy, transition, animate, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SpinnerService } from '../spinner/spinner.service';
import { UserServices } from '../register/services/user.service';
import { User } from '../register/models/user';
import { DomSanitizer } from '@angular/platform-browser';
import { Shared, SharedModel } from '../services/shared.service';
@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	providers: [UserServices],
})
export class NotificationComponent implements OnInit {
	userId: any;
	login_type: any;
	msgClass: string;
	notificationData: any;
	msg: any;
	totalUnread: any;
	p: number = 1;
	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private sharedservice: Shared, private sanitizer: DomSanitizer, private cookieService: CookieService, private spinner: SpinnerService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private renderer: Renderer2, private userServices: UserServices) {

	}
	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() {
		//get User id
		this.userId = this.cookieService.get('userId');
		this.login_type = this.cookieService.get('login_type');
		if (!this.userId) {
			this.router.navigate([''])
		}
		if (this.userId) {
			this.getNotification(this.userId, this.login_type);
		}
	}
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};

	getNotification(id: any, type: any) {
		this.spinner.start();
		this.userServices.getUserNotifications(id, type)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					// sanitizer for html content
					let datanew = this.sanitizer.bypassSecurityTrustHtml(data['data']);
					this.notificationData = datanew['changingThisBreaksApplicationSecurity'];
				} else {
					if (data['status'] == 'success') {
						this.msg = data['message'];
					} else {
						this.msgClass = 'error-message';
						this.msg = data['message'];
					}
				}
			},
			error => {
				// console.log(error);
			});
	}
}//end class
