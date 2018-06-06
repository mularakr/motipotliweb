import { Component, AfterViewInit, Input, Output, OnInit, trigger, state, style, ChangeDetectorRef, ChangeDetectionStrategy, transition, animate, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray } from '@angular/forms';
import { CompanyServices } from '../postjob/services/company.service';
import { JobServices } from '../postjob/services/job.service';
import { Company } from '../postjob/models/company';
import { Job } from '../postjob/models/job';
import { Location } from '@angular/common';
import { UserServices } from '../register/services/user.service';
import { User } from '../register/models/user';

import { NgForm } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SpinnerService } from '../spinner/spinner.service';
import { Shared, SharedModel } from '../services/shared.service';
@Component({
	selector: 'app-viewEmp',
	templateUrl: './viewEmp.component.html',
	providers: [JobServices, CompanyServices, UserServices],
})
export class ViewEmpComponent implements OnInit {
	companies: Company[];
	jobs: Job[];
	userId: string;
	loginType: string;
	msg: string;
	dataArray: any[];
	employeeId: any;
	open: any;
	bidDetails: any[];
	acceptBidDetails: any[];
	employeeDetails: any = {};
	employeeForm: FormGroup;
	profileimg: any;
	checkUserBidStatus: any;

	constructor(private sharedservice: Shared, private location: Location, private cookieService: CookieService, private userServices: UserServices, private companyServices: CompanyServices, private jobService: JobServices, private spinner: SpinnerService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private renderer: Renderer2) {
		this.employeeForm = this.fb.group({
			'name': [''],
			'phone': [''],
			'address': [''],
			'address2': [''],
			'state': [''],
			'city': [''],
			'bio': [''],
			'pincode': [''],
			'email': ['']
		});
	}
	/**
	 * OnInit Function
	 */
	Uid: number;
	ngOnInit() {
		//get job id from url 
		this.route.params.subscribe(params => {
			this.employeeId = params['empId'].split('-');
			if (this.employeeId[0] == null) {
				this.router.navigate(['/openJob'])
			} else {
				this.Uid = this.employeeId[0];
				this.getEmployeeDetailsById(this.employeeId[0]);
				this.getJobBidDetails(this.employeeId[1]);
			}
		});
		this.userId = this.cookieService.get('userId');
		this.loginType = this.cookieService.get('login_type');
		if (!this.userId) {
			this.router.navigate([''])
		}
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
	getEmployeeDetailsById(empId: any) {
		this.spinner.start();
		this.userServices.getUserDetailById(empId)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data'];
					this.employeeDetails.name = this.dataArray['name'];
					this.employeeDetails.phone = this.dataArray['phone'];
					this.employeeDetails.address = this.dataArray['address'];
					this.employeeDetails.address2 = this.dataArray['address2'];
					this.employeeDetails.state = this.dataArray['state'];
					this.employeeDetails.city = this.dataArray['city'];
					this.employeeDetails.bio = this.dataArray['bio'];
					this.employeeDetails.email = this.dataArray['email'];
					this.employeeDetails.pincode = this.dataArray['pincode'];
					if (this.dataArray['profileimg'] != '') {
						this.profileimg = this.dataArray['profileimg'];
					} else {
						this.profileimg = '/assets/images/image_nostroke.png';
					}
				} else {
					if (data['status'] == 'success') {
						this.msg = data['message'];
					} else {
						this.msg = data['message'];
					}
				}
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
					let Data2 = this.bidDetails.filter(person => {
						return person.employee_id == +this.Uid;
					});
					if (Data2[0]['bid_status'] == 0) {
						this.checkUserBidStatus = false;
					} else {
						this.checkUserBidStatus = true;
					}
				} else {
					if (data['status'] == 'success') {
						this.msg = data['message'];
					} else {
						this.msg = data['message'];
						this.checkUserBidStatus = true;
					}
				}
			},
			error => { //console.log(error)
			}
			)
	}

	backClicked() {
		this.location.back();
	}
}//end class
