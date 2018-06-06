import { ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Component, Input, OnInit, trigger, state, style, transition, animate, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserServices } from '../register/services/user.service';
import { User } from '../register/models/user';
import { CookieService } from 'ngx-cookie-service';
import { SpinnerService } from '../spinner/spinner.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Shared, SharedModel } from '../services/shared.service';
import { MessagingService } from "../messaging/messaging.service";
import { ActivatedRoute } from '@angular/router';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';
import { ContentServices } from '../services/content.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	animations: [
		trigger('slideInOut', [
			state('in', style({
				transform: 'translate3d(0, 0, 0)'
			})),
			state('out', style({
				transform: 'translate3d(120%, 0, 0)'
			})),
			transition('in => out', animate('400ms ease-in-out')),
			transition('out => in', animate('400ms ease-in-out'))
		]),
	],
	providers: [UserServices, ContentServices],
})
export class HeaderComponent implements OnInit {
	dologin: boolean = false;
	userName: string;
	loginType: string;
	form: any;
	rerender1 = false;
	userId: any;
	nIntervId: any;
	displayValue: string;
	notificationData: any;
	msg: any;
	totalUnread: any;
	msgClass: string;
	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private sanitizer: DomSanitizer, private sharedservice: Shared, private spinner: SpinnerService, private cookieService: CookieService, private renderer: Renderer2, private cdRef: ChangeDetectorRef, private router: Router, private userServices: UserServices, private msgService: MessagingService) {

		this.msgService.receiveMessage();

		this.router.events.subscribe((event: RouterEvent) => {
		});

		// subscribe to the subjectbehaviour to get the change user name.
		this.sharedservice.changedUserNAme
			.subscribe(
			value => {
				let name = value.split(' ')[0];
				this.userName = name;
			}
			);
	}

	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() {
		//console.log(this.cookieService.get('dologin'));
		if (this.cookieService.get('userId') != '') {
			this.dologin = true;
			this.userId = this.cookieService.get('userId');

			//Split first name from full name header
			let name = this.cookieService.get('name').split(' ')[0];
			this.userName = name;
			this.loginType = this.cookieService.get('login_type');
			this.getUserNotification(this.userId, this.loginType);
			this.msgService.currentMessage.subscribe((data) => {
				this.getUserNotification(this.userId, this.loginType);
			});
		} else {
		}
		// highlight header menu 
		this.router.events.subscribe(event => this.modifyHeader(event));
		setTimeout(() => {
			this.displayValue = this.sharedservice.getData();
		}, 1000);
	}
	menuState: string = 'out';
	closeNavigation: string = 'out';
	toggleClose() {
		this.menuState = 'out';
	}

	/**
	 * Change header active status
	 */
	headerClass: any;
	modifyHeader(location) {
		this.headerClass = location.url;
	}

	/**
	 * toggleMenu for mobile 
	 */
	toggleMenu() {

		this.menuState = this.menuState === 'out' ? 'in' : 'out';
		if (this.menuState == 'in') {
			var bodyclass = document.createAttribute("class");
			bodyclass.value = "ovelay-modal";
			document.getElementsByClassName("background-fade")[0].setAttributeNode(bodyclass);
			this.renderer.addClass(document.body, 'noscroll');
		} else {

			var bodyclass = document.createAttribute("class");
			bodyclass.value = "background-fade";
			document.getElementsByClassName("ovelay-modal")[0].setAttributeNode(bodyclass);
			this.renderer.removeClass(document.body, 'noscroll');
		}
		return false;

	}

	onClickedOutside(e: Event) {
		const elem = document.getElementsByClassName('toggle');
		const element = document.getElementsByTagName('body');
		// If element is present
		if (elem) {
			const classes = elem[0].classList;
			const shouldHide = classes.contains('toggleOut');
			if (shouldHide && this.menuState == 'in') {
				classes.remove('toggleOut');
			} else {
				var bodyclass = document.createAttribute("class");
				bodyclass.value = "background-fade";
				if (this.menuState == 'in') {
					document.getElementsByClassName("ovelay-modal")[0].setAttributeNode(bodyclass);
					this.renderer.removeClass(document.body, 'noscroll');
				}
				this.menuState = 'out';
				classes.add('toggleOut')
			}
		}

	}

	getUserNotification(id: any, type: any) {
		this.userServices.getUserNotifications(id, type)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.msg = '';
					// sanitizer for html content
					let datanew = this.sanitizer.bypassSecurityTrustHtml(data['data']);
					this.notificationData = datanew['changingThisBreaksApplicationSecurity'];
					this.totalUnread = this.notificationData[0]['unread_message'];
				} else {
					if (data['status'] == 'success') {
					} else {
						this.totalUnread = 0;
						this.msgClass = 'error-message';
						this.msg = data['message'];
					}
				}
			},
			error => {
				if (error.message == 'Invalid access token.' || error.message == 'No authorization header sent.') {
					this.cookieService.deleteAll();
					this.dologin = false;
					this.router.navigate(['']);
				}
			});
	}
	/**
	 * Unread total
	 */
	updateUnread() {
		this.totalUnread = 0;
		this.userServices.updateUnreadNotification(this.userId)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
				} else {
					if (data['status'] == 'success') {
						this.msg = data['message'];
					} else {
						this.msg = data['message'];
					}
				}
			},
			error => {
				// console.log(error);
			});
	}

	/**
	 * emit the action for change header 
	 * Do something with the notification (evt) sent by the child!
	 */
	getNotification(evt) {
		let cookieLifeSpan = new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate());
		this.dologin = evt;
		this.cookieService.set('dologin', 'true', cookieLifeSpan, '/');
		this.userId = this.cookieService.get('userId');
		this.userName = this.cookieService.get('name');
		this.loginType = this.cookieService.get('login_type');
		this.getUserNotification(this.userId, this.loginType);
	}

}
