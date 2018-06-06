import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { JobServices } from '../postjob/services/job.service';
import { Job } from '../postjob/models/job';
import { SpinnerService } from '../spinner/spinner.service';
import { CookieService } from 'ngx-cookie-service';
import { Shared, SharedModel } from '../services/shared.service';
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-jobByCategory',
	templateUrl: './jobByCategory.component.html',
	providers: [JobServices],
})


export class JobByCategoryComponent implements OnInit {
	/**
	 * All Variable for this component
	 */
	jobs: Job[];
	msg: any;
	userId: any; //user Id
	loginType: any; // get user login type
	currentCategoryId: any;
	p: number = 1; //pagination number 
	jobsArray: any; //Job details array variable
	jobMsg: any; // message Variable
	msgClass: string;
	valueArray: any = {};
	categoryName: any;
	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private meta: Meta, private sharedservice: Shared, private cookieService: CookieService, private jobService: JobServices, private spinner: SpinnerService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef) {
		this.meta.addTags([{ name: 'Catagory-Jobs', content: 'Job Details by Catagory.' }]);
	}
	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() {
		if (this.cookieService.get('userId') != null) {
			this.userId = this.cookieService.get('userId');
			this.loginType = this.cookieService.get('login_type');
		} else {
			this.loginType = null;
			this.userId = '';
		}
		//Get Param from url
		this.route.params.subscribe(params => {
			this.currentCategoryId = params['jobCategoryId'];
			this.getMyJobsByCategoryId(this.currentCategoryId);
		});
		//check user id and login type	
	}

	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};

	/**
	 * Get Job Details by Catagory Id 
	 * return job details
	 */
	getMyJobsByCategoryId(catId: any) {
		this.valueArray['catId'] = catId;
		this.valueArray['userId'] = this.userId;
		this.spinner.start();
		this.jobService.getJobsByCategoryId(this.valueArray)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.jobsArray = data['data'];
					this.jobMsg = '';
					this.categoryName = this.jobsArray[0]['category_name'];
				} else {
					if (data['status'] == 'success') {
						this.jobMsg = data['message'];
					} else {
						this.categoryName = '';
						this.msgClass = 'error-message';
						this.jobMsg = data['message'];
					}
				}
			},
			error => {
				// console.log(error);
			});
	}

	/**
	 * redirct to home after cancel Edit button clicked 
	 */
	cancelEdit() {
		this.router.navigate(['']);
	}


}
