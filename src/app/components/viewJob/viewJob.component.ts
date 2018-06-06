import { Component, AfterViewInit, Input, Output, OnInit, OnDestroy, trigger, state, style, ChangeDetectorRef, ChangeDetectionStrategy, transition, animate, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray } from '@angular/forms';
import { CompanyServices } from '../postjob/services/company.service';
import { JobServices } from '../postjob/services/job.service';
import { Company } from '../postjob/models/company';
import { Job } from '../postjob/models/job';
import { NgForm } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SpinnerService } from '../spinner/spinner.service';
import { Shared, SharedModel } from '../services/shared.service';
import { environment } from "../../../environments/environment";
@Component({
	selector: 'app-viewjob',
	templateUrl: './viewJob.component.html',
	providers: [JobServices, CompanyServices],
})
export class ViewJobComponent implements OnInit {
	@ViewChild('closeBtn') closeBtn: ElementRef;
	@ViewChild('closeBtn1') closeBtn1: ElementRef;
	@ViewChild('message') message: ElementRef;
	@ViewChild('rejectMessage') rejectMessage: ElementRef;
	@ViewChild('bidMessage') bidMessage: ElementRef;
	@ViewChild('bidDiv') bidDiv: ElementRef;

	/**
	 * All variable
	 */
	companies: Company[];
	jobs: Job[];
	userId: string;
	login_type: string;
	msg: string;
	dataArray: any[];
	currentJobId: any;
	open: any;
	bidDetails: any = [];
	acceptBidDetails: any[];
	setBidValue: any = [];
	bidData;
	msgErr: any;
	bidMsg: any;
	msgClass: string;
	urlShare: string;
	shareBaseUrl: any = [];


	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private sharedservice: Shared, private cookieService: CookieService, private cdr: ChangeDetectorRef, private companyServices: CompanyServices, private jobService: JobServices, private spinner: SpinnerService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private renderer: Renderer2) {
		this.urlShare = environment.shareBaseUrl;
	}

	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() {

		this.route.params.subscribe(params => {
			this.currentJobId = params['jobId'];
			//get details 
			this.getJobDetailsById(this.currentJobId);
			this.getJobBidDetails(this.currentJobId);
			this.getAcceptBidDetails(this.currentJobId);

		});
		this.userId = this.cookieService.get('userId');
		this.login_type = this.cookieService.get('login_type');
	}

	ngOnDestroy() {
		try {
			this.closeBtn.nativeElement.click();
			this.closeBtn1.nativeElement.click();
		} catch (e) { }


	}

	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};
	/**
	 * Get Job details
	 * @param jobId 
	 * Function:getJobDetailsById
	 * Date:
	 * Description:Get job  details
	 */
	getJobDetailsById(jobId: any) {
		this.spinner.start();
		this.jobService.getJobDetails(jobId)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					//check if job is open/booked
					if (data['data']['job_status'] == 0)//0 mean job is open
					{
						this.jobs = data['data'];
						this.jobs['total_wage'] = (this.jobs['total_wage'] != '') ? this.jobs['total_wage'] : 0;
						this.jobs['wage_type'] = (this.jobs['wage_type'] == 'per day') ? '/ day' : (this.jobs['wage_type'] == 'per hour') ? '/ hour' : '/-';
						this.open = 'open';
					} else if (data['data']['job_status'] == 1) { //1 mean job is Booked 
						this.jobs = data['data'];
						this.jobs['total_wage'] = (this.jobs['total_wage'] != '') ? this.jobs['total_wage'] : 0;
						this.jobs['wage_type'] = (this.jobs['wage_type'] == 'per day') ? '/ day' : (this.jobs['wage_type'] == 'per hour') ? '/ hour' : '/-';
						this.open = 'booked';
					}
				} else {
					if (data['status'] == 'success') {
						this.msg = data['message'];
					} else {
						this.msg = data['message'];
					}
				}
				this.shareBaseUrl = this.urlShare + "viewJobDetails/" + this.jobs['job_id'];
			},
			error => {//console.log(error)
			}
			)
	}


	/**
	 * Get Job details
	 * @param jobId 
	 * Function:getJobBidDetails
	 * Date:
	 * Description:Get job  details
	 */
	getJobBidDetails(jobId: any) {
		this.jobService.getJobBidDetails(jobId)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.bidDetails = data['data'];
				} else {
					if (data['status'] == 'success') {
						this.msg = data['message'];
					} else {
						this.bidDetails = [];
						this.msgClass = 'error-message';
						this.bidMsg = data['message'];
						//if no record found in table then reset data array           
					}
				}
			},
			error => {//console.log(error)
			}
			)
	}


	/**
	 * Get Job details
	 * @param jobId 
	 * Function:getJobBidDetails
	 * Date:
	 * Description:Get job  details
	 */
	getAcceptBidDetails(jobId: any) {
		this.jobService.getAcceptBidDetails(jobId)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.acceptBidDetails = data['data'];
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
				//console.log(error)
			}
			)
	}

	/**
	 * bidAcceptReject
	 */
	bidfinalmsg: any;
	msgFinalClass: any;
	bidAcceptReject(message: string, bidStatus: any) {
		/*     if (message == '') {
			  this.msgClass='error-message';
			  this.msgErr = 'Please enter your message';
			} else { */
		this.msgErr = '';
		this.bidData = {};
		this.bidData['emp_id'] = this.setBidValue.emp_id
		this.bidData['job_id'] = this.setBidValue.job_id;
		this.bidData['bid_id'] = this.setBidValue.bid_id;
		this.bidData['message'] = message;
		this.bidData['status'] = bidStatus;
		let index = this.setBidValue.index;
		this.spinner.start();
		this.jobService.bidAcceptRejectData(this.bidData)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {

				} else {

					if (data['status'] == 'success') {

						this.getJobBidDetails(this.setBidValue.job_id);
						if (index !== -1) {
							this.bidDetails.splice(index, 1);
						}
						this.msgFinalClass = 'success-message';
						this.bidfinalmsg = data['message'];

						if (bidStatus == 'accept') {
							setTimeout(() => {
								this.closeBtn.nativeElement.click();
								this.bidMessage.nativeElement.value = null;
								this.bidfinalmsg = '';
							}, 500);

						} else if (bidStatus == 'reject') {
							setTimeout(() => {
								this.closeBtn1.nativeElement.click();
								this.rejectMessage.nativeElement.value = null;
								this.bidfinalmsg = '';
							}, 500);
						}
						window.scrollTo(0, 0);
						this.getAcceptBidDetails(this.setBidValue.job_id);
						//If all job positions accepted 
					} else {
						this.msg = data['message'];
					}
				}
			},
			error => {
				// console.log(error);
			}
			)
		//}
	}

	/**
	 * Set details which going to be accept or delete
	 */
	setVal(emp_id: any, job_id: any, bid_id: any, index: any) {
		//Set details which going to be accept or delete
		this.setBidValue['job_id'] = job_id;
		this.setBidValue['emp_id'] = emp_id;
		this.setBidValue['bid_id'] = bid_id;
		this.setBidValue['index'] = index;
	}

	//(click)="cancleModel('accept');"  
	cancleBidModel(status: any) {

		if (status == 'accept') {
			this.bidMessage.nativeElement.value = null;
			this.msgErr = '';
			this.bidfinalmsg = '';
		}
	}

	cancleBidModel1(status: any) {
		if (status == 'reject') {
			this.rejectMessage.nativeElement.value = null;
			this.msgErr = '';
			this.bidfinalmsg = '';
		}
	}
}//end class
