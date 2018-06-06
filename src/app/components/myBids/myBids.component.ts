import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnInit, OnDestroy, trigger, state, style, transition, animate } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, Validators, FormControl, } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router,Event as RouterEvent, NavigationStart,NavigationEnd } from '@angular/router';
import { JobServices } from '../postjob/services/job.service';
import { Job } from '../postjob/models/job';
import { StatecityServices } from '../register/services/statecity.service';
import { State } from '../register/models/state';
import { HomeServices } from '../home/home.service';
import { Home } from '../home/home';
import { SpinnerService } from '../spinner/spinner.service';
import { CookieService } from 'ngx-cookie-service';
import { UserServices } from '../register/services/user.service';
import { User } from '../register/models/user';
import { NgForm } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { environment } from "../../../environments/environment";
import { Shared, SharedModel } from '../services/shared.service';
import { DatePipe } from '@angular/common';
import { IMyDrpOptions, IMyDateRangeModel, IMyDateRange, IMyInputFieldChanged, IMyCalendarViewChanged, IMyDateSelected } from 'mydaterangepicker';
import { IMyDpOptions, IMyDateModel, IMyOptions, IMyMarkedDates } from 'mydatepicker';
import { FormArray } from '@angular/forms';
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-myBids',
	templateUrl: './myBids.component.html',
	providers: [JobServices, StatecityServices, HomeServices, UserServices],
})
export class MyBidsComponent implements OnInit {
	jobs: Job[];
	homes: Home[];
	states: State[];
	msg: any;
	statesArray: any;
	errormsg: string;
	bidForm: FormGroup; //bid Form
	searchForm: FormGroup; //Form 
	userId: string; //user Id
	loginType: any; // get user login type
	urlShare: string;
	shareBaseUrl: any = [];
	msgClass: string;
	jobsArray: any;
	bidMsg: any;
	setBidValue: any = [];
	@ViewChild('maxValue') maxValue: ElementRef;
	@ViewChild('closebidbox') closebidbox: ElementRef;
	@ViewChild('closeDoc') closeDoc: ElementRef;
	myForm: FormGroup; //Calender form  
	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private meta : Meta, private sharedservice: Shared, private StatecityServices: StatecityServices, private homeService: HomeServices, private cookieService: CookieService, private jobService: JobServices, private spinner: SpinnerService, private fb: FormBuilder, private router: Router, private myElement: ElementRef, private userServices: UserServices) {
		//calender form
		this.myForm = this.fb.group({
			myDateRange: ['', Validators.required]
		});

		//Bid Form 
		this.bidForm = this.fb.group({
			'bid_value': ['', Validators.required],
		});

		this.urlShare = environment.shareBaseUrl;

		router.events.subscribe((event: RouterEvent) => {
			if(event instanceof NavigationStart){
				this.closebidbox.nativeElement.click();
				this.closeDoc.nativeElement.click();
			}
		  });
		this.meta.addTags([{ name: 'my-bids', content: 'list out all Bided jobs of employee.' }]);
	}
	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	getArray: any = [];
	ngOnInit() {
		this.shareBaseUrl = [];
		if (this.cookieService.get('userId') != null) {
			this.userId = this.cookieService.get('userId');
			this.loginType = this.cookieService.get('login_type');
		} else {
			this.loginType = null;
			this.userId = null;
		}
		window.scroll(0, 0);
		this.getEmployeeMyBids(this.userId);
		this.checkUserDocFile(this.userId);
	}

	/**
   * Respond after Angular initializes the component's views and child views
   */
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};
	
	ngOndestroy(){
		
		this.closebidbox.nativeElement.click();
		let el: HTMLElement = this.closeDoc.nativeElement as HTMLElement;
		el.click();
	}
	/**
   * Date picker options
   */
  myDateRangePickerOptions: IMyDrpOptions = {
	// other options...
	dateFormat: 'yyyy-mm-dd',
	firstDayOfWeek: 'mo',
	sunHighlight: true,
	inline: false,
	showClearDateRangeBtn:false

};
	/**
	* On Change date function 
		Get selected date range
	*/
	modelDateArray: any = {};
	dateArray: any = {};
	las: any;
	onDateRangeChanged(event: IMyDateRangeModel) {
		if(event.formatted !=''){
			let date = event.formatted;
			var begin = event.formatted.split(" ")[0];
			var end = event.formatted.split(" ")[2];
			this.modelDateArray.start = begin;
			this.modelDateArray.end = end;
			this.dateArray['start'] = begin;
			this.dateArray['end'] = end;
			this.getMyBidsDetailsByCalendar(this.dateArray);
		}else{
			this.getEmployeeMyBids(this.userId);
		}
	}


	/**
	* Get My Bids details by calendar date
	*/
	getMyBidsDetailsByCalendar(dateAray: any) {
		this.jobsArray = null;
		dateAray['user_id'] = this.userId;
		//console.log(dateAray['user_id']);
		if (dateAray != '') {
			this.spinner.start();
			this.jobService.getMyBidsByCalendar(dateAray)
				.subscribe(
				data => {
					this.spinner.stop();
					if (typeof data['data'] !== 'undefined') {
						//console.log(data['data']);
						this.jobsArray = this.findJobAndMeargeStatus(data['data']);
						this.jobMsg = '';
						//create url for share button
						this.jobsArray.forEach((job, i) => {
							this.shareBaseUrl[i] = this.urlShare + "viewJobDetails/" + job['job_id'];
						});
					} else {
						if (data['status'] == 'success') {

						} else {
							this.jobsArray = null;
							this.msgClass = 'error-message';
							if (this.jobsArray == null) {
								this.jobMsg = 'No record found';
							}
						}
					}
					

				}
				)
		} else {
			this.getEmployeeMyBids(this.userId);
		}
	}

	/**	 
	 * Get Employee all bids details 
	 */
	p: number = 1;
	jobMsg: any;
	getEmployeeMyBids(userId: any) {
		this.spinner.start();
		this.jobService.employeeMyBids(userId)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					//console.log(data['data']);
					//Call the function findJobAndMeargeStatus
					this.jobsArray = this.findJobAndMeargeStatus(data['data']);
					this.jobMsg = '';
					this.jobsArray.forEach((job, i) => {
						this.shareBaseUrl[i] = this.urlShare + "viewJobDetails/" + job['job_id'];
					});
				} else {
					this.msgClass = 'error-message';
					this.jobMsg = data['message'];
				}
				//create url for share button
				/*this.jobsArray.forEach((job, i) => {
					this.shareBaseUrl[i] = this.urlShare + "viewJob/" + job['job_id'];
				});*/
			},
			error => {
				console.log(error);
			});
	}

	/**
	 * findJobAndMeargeStatus
	 * mearge duplicate job bid
	 */
	findJobAndMeargeStatus(data: any) {
		var obj = {};
		let inputArray: any = data;
		for (var i = 0, len = inputArray.length; i < len; i++) {

			if (obj[inputArray[i]['job_id']] == null) {

				let bid_status = inputArray[i]['bid_status'];
				let bid_amount = inputArray[i]['bid_amount'];

				obj[inputArray[i]['job_id']] = inputArray[i];

				obj[inputArray[i]['job_id']]['bid_amount'] = [];
				obj[inputArray[i]['job_id']]['bid_status'] = [];

				obj[inputArray[i]['job_id']]['bid_amount'][0] = bid_amount;
				obj[inputArray[i]['job_id']]['bid_status'][0] = bid_status;

			} else {

				let tempBidStatus: any = [];
				(Array.isArray(obj[inputArray[i]['job_id']]['bid_status'])) ?
					tempBidStatus = obj[inputArray[i]['job_id']]['bid_status'] : tempBidStatus[0] = obj[inputArray[i]['job_id']]['bid_status'];

				obj[inputArray[i]['job_id']]['bid_status'] = [];
				tempBidStatus.forEach(bid_amount => {
					obj[inputArray[i]['job_id']]['bid_status'].push(bid_amount);
				});
				obj[inputArray[i]['job_id']]['bid_status'].push(inputArray[i]['bid_status']);


				let tempJobId: any = [];
				(Array.isArray(obj[inputArray[i]['job_id']]['bid_amount'])) ?
					tempJobId = obj[inputArray[i]['job_id']]['bid_amount'] : tempJobId[0] = obj[inputArray[i]['job_id']]['bid_amount'];

				obj[inputArray[i]['job_id']]['bid_amount'] = [];
				tempJobId.forEach(bid_amount => {
					obj[inputArray[i]['job_id']]['bid_amount'].push(bid_amount);
				});
				obj[inputArray[i]['job_id']]['bid_amount'].push(inputArray[i]['bid_amount']);
			}
		}
		inputArray = new Array();
		for (var key in obj) {
			inputArray.push(obj[key]);
		}
		return inputArray.reverse(); //return final array
	}


	/**
   * Get Job details
   * @param jobId 
   * Function:getJobDetailsById
   * Date:
   * Description:Get job  details
   */
	jobcost: any;
	buyerCost: any;
	idProof: any;
	docMsg: any;
	jobBookedStatus: number;
	maxBidValue: any;
	jobID: any;
	getJobDetailsById(jobId: any) {
		this.jobID = jobId;
		this.jobService.getJobDetails(this.jobID)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.jobs = data['data'];
					this.maxBidValue = this.jobs['allowbid_cost'];
					this.buyerCost = this.jobs['buyer_cost'];
					this.jobcost = this.jobs['jobcost'];
					this.jobBookedStatus = this.jobs['job_status'];
					this.idProof = this.jobs['idproof'];
					//console.log(this.jobs);
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
	 * Check if user have documents
	 * document count
	 */
	docCount: any;
	checkUserDocFile(user_id: any) {
		this.userServices.getUserDocDetails(user_id)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.docCount = data['data']['count'];
				} else {
					this.msg = data['message'];
				}
			},
			error => {
				// console.log(error);
			});
	}

	/**
	 * Post Bid Details
	 * and check max job details
	 */
	postBidData(formData: any, bidform: NgForm) {
		// console.log(formData);
		if (Number(formData['bid_value']) > Number(this.maxBidValue) || Number(formData['bid_value']) < this.buyerCost) {
			//eventValue.target.focus();
			this.msgClass = 'error-message';
			this.maxValue.nativeElement.focus();
			this.maxValue.nativeElement.value = null;
			this.bidMsg = 'Your bid was rejected';
		} else if (this.idProof != '0') {

			if (this.docCount == '0') {
				this.msgClass = 'error-message';
				this.maxValue.nativeElement.focus();
				this.maxValue.nativeElement.value = null;
				this.bidMsg = 'You need to upload id proof document for this job';

			} else {
				this.bidMsg = '';
				this.saveBidData(formData, bidform);
			}

		} else {
			this.bidMsg = '';
			this.saveBidData(formData, bidform);
		}

	}

	/**
	 * Send Bid Details for jobs
	 */
	saveBidData(formData: any, bidform: NgForm) {
		this.bidMsg = '';
		formData['user_id'] = this.userId;
		formData['job_id'] = this.jobID;
		//formData['login_type'] = this.login_type;
		//console.log(formData);
		this.spinner.start();
		this.jobService.placeUserBid(formData)
			.subscribe(
			data => {
				this.spinner.stop();
				this.getEmployeeMyBids(this.userId);
				if (typeof data['data'] !== 'undefined') {
					// console.log(data['data']);
				} else {
					if (data['status'] == 'success') {
						//alert(data['message']);
						bidform.resetForm();
						this.msgClass = 'success-message';					
						this.bidMsg = data['message'];
						setTimeout(()=>{    
							this.bidMsg = '';
							this.closebidbox.nativeElement.click();						
						},4000);
					} else {
						this.msgClass = 'error-message';
						this.bidMsg = data['message'];
						//this.setBidValue.reset();
					}
				}
			},
			error => {
				// console.log(error);
			});

	}

	/**
	 * Apply for job
	 */
	applyBidData(formData: any, jobID: any) {
		this.bidMsg = '';
		formData['user_id'] = this.userId;
		formData['job_id'] = jobID;
		//console.log(formData);
		// formData['login_type'] = this.login_type;
		//console.log(formData);
		this.spinner.start();
		this.jobService.placeUserBid(formData)
			.subscribe(
			data => {
				this.spinner.stop();
				this.getEmployeeMyBids(this.userId);
				if (typeof data['data'] !== 'undefined') {
					// this.bidDetailsArray = data['data'];
					// console.log(data['data']);
				} else {
					if (data['status'] == 'success') {
						// console.log(data['message']);
						//alert(data['message']);
						//this.getUserBidDetails(this.currentJobId, this.userId);
						this.msg = '';
					} else {
						//this.bidMsg = data['message'];
						//console.log(data['message']);
						//alert(this.bidMsg);
					}
				}
			},
			error => {
				// console.log(error);
			});

	}

	/**
   * Set job id and buyer cost which going to be update 
   */
	setVal(buyer_cost: any, job_id: any) {
		//Set details which going to be accept or delete  
		// let bform = {};
		this.setBidValue = {};
		this.setBidValue['bid_value'] = buyer_cost;
		this.applyBidData(this.setBidValue, job_id);
	}


	/**
	 * privent Char  value
	 */
	checkNumeric(event: any) {
		const pattern = /[0-9\+\-\ ]/;
		let inputChar = String.fromCharCode(event.charCode);

		if (!pattern.test(inputChar) && event.charCode != '0') {
			event.preventDefault();
		}
	}
	/**
	 * Cancle bid model form
	 */
	cancleForm(form: any) {
		form.resetForm();
		this.bidMsg = '';
	}
	
	/*//share Buttons Show-Hide
	public frameShowHide: boolean = false;
	shareButtonShowHide(index) {
		if (this.frameShowHide === false) {
			this.frameShowHide = index;
		} else {
			this.frameShowHide = !this.frameShowHide;
		}
	}//share Buttons Show-Hide End//*/


}
