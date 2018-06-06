import { Component, AfterViewInit, Input, Output, OnInit, trigger, state, style, ChangeDetectorRef, ChangeDetectionStrategy, transition, animate, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StatecityServices } from '../register/services/statecity.service';
import { State } from '../register/models/state';
import { City } from '../register/models/city';
import { Company } from '../postjob/models/company';
import { CompanyServices } from '../postjob/services/company.service';
import { JobServices } from '../postjob/services/job.service';
import { Job } from '../postjob/models/job';
import { NgForm } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { SpinnerService } from '../spinner/spinner.service';
import { CookieService } from 'ngx-cookie-service';
import { UpperCasePipe } from '@angular/common/src/pipes/case_conversion_pipes';
import { Shared, SharedModel } from '../services/shared.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-makePayment',
	templateUrl: './makePayment.component.html',
	providers: [StatecityServices, CompanyServices, JobServices],
})
export class MakePaymentComponent implements OnInit {

	states: State[];
	cities: City[];
	userId: any;
	companies: Company[];
	markJob_id: any;
	jobMarkArray: any = [];
	errorMessage: String;
	merchant_key: any = "gtKFFx";
	salt: any = "eCwWELxi";
	payu_base_url: any = "https://test.payu.in"; // For Test environment
	action: any = '';
	myDetails: any = [];
	ratingMsg: any;
	msgClass: string;
	markjob_id: any;
	myPaymentMsg: any;
	ratingInfo: any;
	details: any = {};
	ratingval: any;
	myPaymentOptions: any;
	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	payuFrom: FormGroup; //Form 
	ratingFrom: FormGroup; //Form 
	constructor(private meta: Meta, private sharedservice: Shared, private cookieService: CookieService, private jobService: JobServices, private spinner: SpinnerService, private CompanyServices: CompanyServices, private fb: FormBuilder, private StatecityServices: StatecityServices, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private renderer: Renderer2) {
		this.payuFrom = this.fb.group({
			'payment_source': ['', Validators.required],
			'lastname': ['lastname'], //in last name first is user_id , 2nd is job_id     
			'amount': ['amount'],
			'email': ['email'],
			'firstname': ['firstname'],
			'furl': ['furl'],
			'hash': ['hash'],
			'key': ['key'],
			'phone': ['phone'],
			'productinfo': ['productinfo'],
			'surl': ['surl'],
			'txnid': ['txnid'],
		});

		this.ratingFrom = this.fb.group({
			'rating': ['', Validators.required],
		});
		this.meta.addTags([{ name: 'payment', content: 'payment details and ratings.' }]);
	}

	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() {
		//Get Param from url
		this.route.params.subscribe(params => {
			this.markJob_id = params['markJob_id'];
			this.getMyJobsAndBidDetails(this.markJob_id);
			this.getAllPaymentOptionsDetails();
		});

		this.userId = this.cookieService.get('userId');
		if (!this.userId) {
			this.router.navigate([''])
		}
	}
	/**
	 * Respond after Angular initializes the component's views and child views
	 */
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};

	/**
	 * Get Job and bid details for current jobcomplete id 
	 * Get All Payment Options available
	 * @argument NA
	 * @returns 
	 */
	getAllPaymentOptionsDetails() {
		//getMarkJobDetailsForEmployerByID for payment
		let flag = '1';
		this.jobService.app_getAllPaymentOptionsDetails(flag)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.myPaymentOptions = data['data'];
				} else {
					if (data['status'] == 'success') {
					} else {
					}
				}

			});

	}

	/**
	 * Get Job and bid details for current jobcomplete id 
	 * Get Details From job mark complete table 
	 * @argument markJob_id
	 * @returns 
	 */
	getMyJobsAndBidDetails(markJob_id: any) {
		//getMarkJobDetailsForEmployerByID for payment
		this.spinner.start();
		this.jobService.getMarkJobDetailsForEmployerByID(markJob_id)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.jobMarkArray = data['data'];
					this.getGanratedDetails(this.jobMarkArray);
					this.getRatingStatus();
				} else {
					if (data['status'] == 'success') {
					} else {
					}
				}

			});
	}

	getGanratedDetails(myArrayDetails: any) {
		//getMarkJobDetailsForEmployerByID for payment
		this.spinner.start();
		this.jobService.app_getGanratedDetails(myArrayDetails)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.myDetails = data['data'];
				} else {
					if (data['status'] == 'success') {
					} else {
					}
				}

			});
	}
	/**
	 * Submit data to payubiz form 
	 * @argument fromData
	 * @returns 
	 */
	submitData(fromData: any) {

		if (fromData['payment_source'] == 'payu') { //if payment by card
			var form = document.createElement("form");
			form.setAttribute("method", "post");
			form.setAttribute("action", "https://test.payu.in/_payment");
			for (var key in fromData) {
				if (fromData.hasOwnProperty(key)) {
					var hiddenField = document.createElement("input");
					hiddenField.setAttribute("type", "hidden");
					hiddenField.setAttribute("name", key);
					hiddenField.setAttribute("value", fromData[key]);
					form.appendChild(hiddenField);
				}
			}
			document.body.appendChild(form);
			form.submit();

		} else {
			this.spinner.start();
			this.jobService.app_payAmountByCash(fromData)
				.subscribe(
				data => {
					this.spinner.stop();
					if (typeof data['data'] !== 'undefined') {
						//this.ratingInfo=data['data'];
						//this.ratingval=this.ratingInfo.ratingval;          
						//this.ratingMsg=null;
					} else {
						if (data['status'] == 'success') {
							this.msgClass = 'success-message';
							this.myPaymentMsg = data['message'];
							setTimeout(() => {
								this.myPaymentMsg = '';
							}, 2000);
							// this.ratingMsg=data['message'];                
						} else {
							this.msgClass = 'error-message';
							this.myPaymentMsg = data['message'];
							setTimeout(() => {
								this.myPaymentMsg = '';
							}, 2000);
						}
					}
				});
		}
	}

	/**
	 * getRatingStatus
	 * @argument NA
	 * @returns 
	 */
	getRatingStatus() {
		if (this.jobMarkArray != '') {
			this.details['employer_id'] = this.jobMarkArray['Job']['user_id'];//Employer
			this.details['employee_id'] = this.jobMarkArray['JobComplete']['user_id'];//Employeee
			this.details['job_id'] = this.jobMarkArray['Job']['id'];
			this.jobService.app_getRatingInfo(this.details)
				.subscribe(
				data => {

					if (typeof data['data'] !== 'undefined') {
						this.ratingInfo = data['data'];
						this.ratingval = this.ratingInfo.ratingval;
						this.ratingMsg = null;
					} else {

						if (data['status'] == 'success') {
							// this.msgClass = 'success-message';
							// this.ratingMsg=data['message'];                
						} else {
							// this.msgClass='error-message';  
							// this.ratingMsg=data['message'];
						}
					}

				});
		}
	}

	/**
	 * rating to employee data
	 * @argument fromData
	 * @returns 
	 */
	submitRating(fromData: any) {
		if (this.jobMarkArray != '') {
			fromData['employer_id'] = this.jobMarkArray['Job']['user_id'];//Employer
			fromData['employee_id'] = this.jobMarkArray['JobComplete']['user_id'];//Employeee
			fromData['job_id'] = this.jobMarkArray['Job']['id'];
			this.spinner.start();
			this.jobService.app_setRatingDetails(fromData)
				.subscribe(
				data => {
					this.spinner.stop();
					if (typeof data['data'] !== 'undefined') {
					} else {

						if (data['status'] == 'success') {
							this.msgClass = 'success-message';
							this.ratingMsg = data['message'];
							setTimeout(() => {
								this.ratingMsg = null;
								this.getRatingStatus();
							}, 2000);
						} else {
							this.msgClass = 'error-message';
							this.ratingMsg = data['message'];
							setTimeout(() => {
								this.ratingMsg = null;
							}, 2000);
						}
					}

				});
		}
	}
}
