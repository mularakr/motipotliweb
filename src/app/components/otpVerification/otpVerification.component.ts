import { Component, AfterViewInit, Input, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute, Params, NavigationCancel } from '@angular/router';
import { UserServices } from '../register/services/user.service';
import { User } from '../register/models/user';
import { ViewChild, ElementRef } from '@angular/core';
import { URLSearchParams, } from '@angular/http';
import { NgForm } from '@angular/forms';
import { SpinnerService } from '../spinner/spinner.service';
import { Shared, SharedModel } from '../services/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { otpVerificationService } from './otpVerification.service';
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-otpVerification',
	templateUrl: './otpVerification.component.html',
	providers: [UserServices],
})
export class OtpVerificationComponent implements OnInit {
	@ViewChild('closeOtpModal') closeOtpModal: ElementRef;
	@ViewChild('otpOpen') otpOpen: ElementRef;
	otpForm: FormGroup;
	changeForm: FormGroup;
	userId: any;
	dologin: boolean = false;
	msgClass: any;
	otpMessage: any;
	changeMessage: any;
	isOTP: any;
	isFormChange: any;
	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private meta: Meta, private sharedservice: Shared, private cookieService: CookieService, private spinner: SpinnerService, private userServices: UserServices, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private otpVerificationService: otpVerificationService) {
		this.isFormChange = false;
		this.otpForm = this.fb.group({
			'otp': ['', Validators.required],
		});
		this.changeForm = this.fb.group({
			'mobile': ['', Validators.required],
		});

		otpVerificationService.popstatus.subscribe((popstatus: any) => {

			if (popstatus == true) {
				this.userId = this.cookieService.get('userId');
				this.otpOpen.nativeElement.click();
			}
		});

		this.meta.addTags([{ name: 'otp-varification', content: 'Send otp for varification.' }]);
	}
	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() {
		this.userId = this.cookieService.get('userId');
	}

	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};

	active(evt: any) {
		this.userId = this.cookieService.get('userId');
		this.otpOpen.nativeElement.click();
	}
	/**
	 * Send otp for varification
	 */
	otpVarify(formData: any, fm: any) {
		formData['user_id'] = this.userId;
		this.spinner.start();
		this.userServices.varifyOtp(formData)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
				} else {
					if (data['status'] == 'success') {
						this.msgClass = 'success-message';
						this.otpMessage = data['message'];

						setTimeout(() => {
							this.otpMessage = null;
							this.closeOtpModal.nativeElement.click();
							this.cookieService.set('otp_status', null);
						}, 2000);
					} else {
						this.msgClass = 'error-message';
						this.otpMessage = data['message'];
						setTimeout(() => {
							this.otpMessage = null;
						}, 1500);
					}
				}
			},
			error => {
				// console.log(error);
			});
	}

	regenerateOTP() {
		this.spinner.start();
		this.userServices.regenerateMobileOtp(this.userId)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
				} else {
					if (data['status'] == 'success') {
						this.msgClass = 'success-message';
						this.otpMessage = data['message'];
						setTimeout(() => {
							this.otpMessage = null;
						}, 3000);
					} else {
						this.msgClass = 'error-message';
						this.otpMessage = data['message'];
						setTimeout(() => {
							this.otpMessage = null;
						}, 3000);
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
	 *  check Numeric value
	 */
	checkNumeric(event: any) {

		const pattern = /[0-9\+\-\ ]/;
		let inputChar = String.fromCharCode(event.charCode);
		if (!pattern.test(inputChar) && event.charCode != '0') {
			event.preventDefault();
		}
	}

	changePhone() {
		this.isFormChange = true;
	}

	changeMobile(formData: any, fm: any) {

		this.spinner.start();
		this.userServices.updateMobileNumber({ user_id: this.userId, phone: formData.mobile })
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
				} else {
					if (data['status'] == 'success') {
						this.msgClass = 'success-message';
						this.changeMessage = data['message'];
						setTimeout(() => {
							this.changeMessage = null;
							this.isFormChange = false;
						}, 3000);
					} else {
						this.msgClass = 'error-message';
						this.changeMessage = data['message'];
						setTimeout(() => {
							this.changeMessage = null;
						}, 3000);
					}
				}
			},
			error => {
				// console.log(error);
			});
	}
}
