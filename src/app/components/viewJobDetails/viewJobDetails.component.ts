import { Component, Input, Output, OnInit, trigger, state, style, ChangeDetectorRef, ChangeDetectionStrategy, transition, animate, Renderer2, AfterViewInit } from '@angular/core';
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

import { UserServices } from '../register/services/user.service';
import { User } from '../register/models/user';
import { Shared, SharedModel } from '../services/shared.service';
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-viewJobDetails',
	templateUrl: './viewJobDetails.component.html',
	providers: [JobServices, CompanyServices, UserServices],
})
export class ViewJobDetailsComponent implements OnInit {
	companies: Company[];
	jobs: Job[];
	userId: string;
	loginType: any;
	login_type: string;
	msg: string;
	dataArray: any[];
	currentJobId: any;
	open: any;
	imageArray: any = [];
	msgClass: string;
	jobcost: any;
	buyerCost: any;
	idProof: any;
	docMsg: any;

	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private meta: Meta, private sharedservice: Shared, private cookieService: CookieService, private companyServices: CompanyServices, private jobService: JobServices, private spinner: SpinnerService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private renderer: Renderer2, private userServices: UserServices) {
		this.sharedservice.userLoginType.subscribe(data => {
			this.loginType = data;
		});
		this.meta.addTags([{ name: 'job-details', content: 'Get job details.' }]);
	}
	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	message: string;
	ngOnInit() {
		//get job id from url 
		if (this.cookieService.get('userId') != null) {
			this.userId = this.cookieService.get('userId');
			this.loginType = this.cookieService.get('login_type');
		} else {
			this.loginType = null;
			this.userId = null;
		}


		this.route.params.subscribe(params => {
			this.currentJobId = params['job_Id'];
			this.getJobDetailsById(this.currentJobId);
		});
	}


	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	}

	/**
	 * Get Job details
	 * @param jobId 
	 * Function:getJobDetailsById
	 * Date:
	 * Description:Get job  details
	 */
	getJobDetailsById(jobId: any) {
		this.jobService.getJobDetailsforGuestUser(jobId)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.jobs = data['data'];
					this.imageArray = this.jobs['imageArray'];
					if (this.loginType == 'employer') {

						this.msgClass = 'error-message';
						this.message = 'You can not apply for this job as you are logged in as an Employer. Please logout, login as an Employee and apply for this job';

					} else {
						this.msgClass = 'error-message';
						this.message = 'Please register/login for apply';
					}

				} else {
					if (data['status'] == 'success') {
						this.msg = data['message'];
					} else {
						this.imageArray = '';
						this.msgClass = 'error-message';
						this.msg = data['message'];
					}
				}
			}
			)
	}

	/**
	 * Cancle bid model form
	 */
	cancleForm(form: any) {
	}
}//end class
