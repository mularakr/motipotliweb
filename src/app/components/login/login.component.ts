import { Component, AfterViewInit, Input, Output, OnInit, trigger, state, style, transition, animate, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserServices } from '../register/services/user.service';
import { LoginServices } from './services/login.service';
import { Login } from './models/login';
import { ViewChild, ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgForm } from '@angular/forms';
import { Shared, SharedModel } from '../services/shared.service';
import { otpVerificationService } from '../otpVerification/otpVerification.service';
import { MessagingService } from "../messaging/messaging.service";
import { environment } from "../../../environments/environment";
import { SpinnerService } from '../spinner/spinner.service';
import { ContentServices } from '../services/content.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	providers: [LoginServices, ContentServices],
})
export class LoginComponent implements OnInit {
	@ViewChild('fileInput') fileInput: ElementRef;
	@ViewChild('close') close: ElementRef;
	logins: Login[];
	@Input() login;
	@Output() islogin: EventEmitter<any> = new EventEmitter();
	isLoggedIn: boolean = false;
	signInForm: FormGroup;
	errorMessage: String;
	response: any;
	loading = false;
	message: string;
	msg: any;
	dataArray: any;
	todayDate: number;
	salt: any;
	currentUrl: any;
	employerUrl: any;
	employeeUrl: any;
	AboutdataArray: any;
	Aboutmessage: any;
	aboutmydata: any;
	msgClass: any;
	constructor(private meta: Meta, private sanitizer: DomSanitizer, private contentServices: ContentServices, private sharedservice: Shared, private cookieService: CookieService, private spinner: SpinnerService, private loginServices: LoginServices, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private renderer: Renderer2, private otpService: otpVerificationService, private messagingService: MessagingService) {
		this.signInForm = this.fb.group({
			'email': ['', Validators.required],
			'password': ['', Validators.required],
			'login_type': ['', Validators.required],
		});

		this.salt = environment.passSalt;
		this.employerUrl = environment.employerUrl;
		this.employeeUrl = environment.employeeUrl;
		this.meta.addTags([{ name: 'login', content: 'Login functionalities.' }]);
	}
	ngOnInit() {

		this.sharedservice.changedHederContent.subscribe(
			(data) => {
				this.getAboutUsDetails(localStorage.getItem('about'));
			}
		);
	}
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};
	/**
	 * Login Function 
	 *@param : Form data
	 */
	signIn(formData: any) {
		this.spinner.start();
		let val = window.btoa(formData['password']);
		let salt = this.salt + '%' + val;
		formData['password'] = salt;

		this.loginServices.signInUser(formData)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.signInForm.reset();
					this.fileInput.nativeElement.click();
					this.dataArray = data['data'];
					this.messagingService.receiveMessage();
					let cookieLifeSpan = new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate());
					this.cookieService.set('userId', this.dataArray['User']['id'], cookieLifeSpan, '/');
					this.cookieService.set('access_token', this.dataArray['User']['access_token'], cookieLifeSpan, '/');
					this.cookieService.set('name', this.dataArray['User']['name'], cookieLifeSpan, '/');
					this.cookieService.set('email', this.dataArray['User']['email'], cookieLifeSpan, '/');
					this.cookieService.set('login_type', this.dataArray['User']['login_type'], cookieLifeSpan, '/');
					this.cookieService.set('otp_status', this.dataArray['User']['otp_status'], cookieLifeSpan, '/');
					this.sharedservice.userLoginType.next(this.dataArray['User']['login_type']);
					this.islogin.emit(true);
					this.sharedservice.IsUserLoggedIn.next(this.dataArray['User']['login_type']);
					if (this.dataArray['User']['otp_status'] == '1') {
						this.otpService.openPop();
					} else {
						let currentUrl: any = this.router.url;
						currentUrl = currentUrl.split('/');
						if (this.dataArray['User']['login_type'] == 'employer') {
							//Server page refresh for employer
							window.location.assign(this.employerUrl);
						} else {

							if (currentUrl[1] == 'viewJobDetails' || currentUrl[1] == 'geographicalSearch') {
								this.messagingService.getPermission(this.dataArray['User']['id'], this.router.url);
								this.messagingService.receiveMessage();
							} else {
								//Server page refresh for employee
								window.location.assign(this.employeeUrl);
							}
						}
					}
					// window.location.reload();                 
				} else {
					if (data['status'] == 'success') {
						this.signInForm.reset();
						this.fileInput.nativeElement.click();
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
	 * Close the form and reset form value
	 */
	closeForm(form: NgForm) {
		form.resetForm();
	}

	/**
		* get user details by id
		* @param: userId
		* @type:string
		*/
	getAboutUsDetails(data: any) {
		this.message = '';
		if (data != null) {
			this.AboutdataArray = data;
			let datanew = this.sanitizer.bypassSecurityTrustHtml(this.AboutdataArray);
			let aboutmydata = datanew['changingThisBreaksApplicationSecurity'].split('</p>');
			if (typeof aboutmydata != null) {
				this.aboutmydata = aboutmydata[0];
			} else {
				this.aboutmydata = datanew['changingThisBreaksApplicationSecurity'].substring(0, 170);
			}
			if (this.aboutmydata == '') {
				this.msgClass = 'error-message';
				this.Aboutmessage = 'no record found';
			}
		}
	}

	add_class() {
		setTimeout(() => { this.renderer.addClass(document.body, 'modal-open'); }, 400);
	}
}
