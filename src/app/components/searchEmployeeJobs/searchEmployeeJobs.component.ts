import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnInit, OnDestroy, trigger, state, style, transition, animate } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, Validators, FormControl, } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';
import { JobServices } from '../postjob/services/job.service';
import { Job } from '../postjob/models/job';
import { StatecityServices } from '../register/services/statecity.service';
import { State } from '../register/models/state';
import { HomeServices } from '../home/home.service';
import { Home } from '../home/home';
import { UserServices } from '../register/services/user.service';
import { User } from '../register/models/user';
import { SpinnerService } from '../spinner/spinner.service';
import { CookieService } from 'ngx-cookie-service';
import { NgForm } from '@angular/forms';
import { environment } from "../../../environments/environment";
import { Shared, SharedModel } from '../services/shared.service';
import { DatePipe } from '@angular/common';
import { IMyDpOptions, IMyDateModel, IMyOptions, IMyMarkedDates } from 'mydatepicker';
@Component({
	selector: 'app-searchEmployeeJobs',
	templateUrl: './searchEmployeeJobs.component.html',
	providers: [JobServices, StatecityServices, HomeServices, UserServices],
})
export class SearchEmployeeJobsComponent implements OnInit {
	jobs: Job[];
	homes: Home[];
	states: State[];
	msg: any;
	temp: any;
	statesArray: any;
	errormsg: string;
	searchForm: FormGroup; //Form 
	userId: string; //user Id
	loginType: any; // get user login type
	urlShare: string;
	shareBaseUrl: any = [];
	msgClass: string;
	jobsArray: any = [];
	searchJobForm: FormGroup;
	employeeSearchBidForm: FormGroup;
	mobileClass: any;
	p: number = 1;
	myJobsArray: any;
	jobMsg: string;
	getArray: any = [];
	docCount: any;
	jobcost: any;
	buyerCost: any;
	idProof: any;
	docMsg: any;
	jobBookedStatus: number;
	maxBidValue: any;
	jobID: any;
	totalWage: any;
	wageType: any;
	bidMsg: any;
	@ViewChild('maxValue') maxValue: ElementRef;
	@ViewChild('closebidbox') closebidbox: ElementRef;
	@ViewChild('closeSearchModalBtn') closeSearchModalBtn: ElementRef;
	//set placeholder in date inputbox
	public placeholder: string = 'Select a start date';
	public placeholder1: string = 'Select a end date';

	/**
	 * Date Function with variables,Options
	 */
	startDateOptions: IMyDpOptions = {
		inline: false,
		selectorWidth: '100%',
		dateFormat: 'yyyy-mm-dd',
		markCurrentDay: true,
		showClearDateBtn: false
	};
	//end date
	endDateOptions: IMyDpOptions = {
		inline: false,
		selectorWidth: '100%',
		dateFormat: 'yyyy-mm-dd',
		showClearDateBtn: false
	};
	// Calling this function set a new placeholder text
	changePlaceholder() {
		this.placeholder = '';
	}
	/**
	 * End date picker setting 
	 */
	//Drop Down for category
	dropdownList = [];
	selectedItems: any = [];
	dropdownSettings = {};

	/**
	* category Dropdown
	*/
	onItemSelect(item: any) {
		//console.log(item);
		// console.log(this.selectedItems);
	}
	OnItemDeSelect(item: any) {
		//console.log(item);
		// console.log(this.selectedItems);
	}
	onSelectAll(items: any) {
		//console.log(items);
	}
	onDeSelectAll(items: any) {
		//console.log(items);
	}

	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private sharedservice: Shared, private StatecityServices: StatecityServices, private homeService: HomeServices, private cookieService: CookieService, private jobService: JobServices, private spinner: SpinnerService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private userServices: UserServices) {
		this.searchJobForm = this.fb.group({
			'startdate': [''],
			'enddate': [''],
			'state_id': [''],
			'category_id': [''],
		});
		//Bid Form 
		this.employeeSearchBidForm = this.fb.group({
			'bid_value': ['', Validators.required],
		});

		this.urlShare = environment.shareBaseUrl;

		router.events.subscribe((event: RouterEvent) => {
			if (event instanceof NavigationStart) {
				this.closebidbox.nativeElement.click();
				this.closeSearchModalBtn.nativeElement.click();
			}
		})
	}
	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() {
		this.shareBaseUrl = [];
		if (this.cookieService.get('userId') != null) {
			this.userId = this.cookieService.get('userId');
			this.loginType = this.cookieService.get('login_type');
			this.getSearchEmployeeJobsByUserId(this.userId);
			this.checkUserDocFile(this.userId);
		} else {
			this.loginType = null;
			this.userId = null;
		}
		window.scroll(0, 0);
		this.getAllCategory();
		this.getAllStates();
		this.mobileClass = 'mobileListingView';

		//Drop Down for Category
		this.dropdownSettings = {
			singleSelection: false,
			text: "- Categories -",
			selectAllText: 'Select All',
			unSelectAllText: 'UnSelect All',
			enableSearchFilter: true,
			classes: "myclass custom-class",
			badgeShowLimit: 1
		};

	}

	/**
   * Respond after Angular initializes the component's views and child views
   */
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};

	ngOndestroy() {
		this.closebidbox.nativeElement.click();
		this.closeSearchModalBtn.nativeElement.click();
	}

	/**
	 * +++++++++++++++++++++++++++++++++++++++++++++++++++
	 * @param event Date
	 * ++++++++++++++++++++++++++++++++++++++++++++++++++++
	 */
	//start date select
	public onStartDateChanged(event: IMyDateModel) {
		if (!event.jsdate) {
			return;
		}
		let dateValue: Date = new Date(event.jsdate.getTime());
		// set previous of selected date
		dateValue.setDate(dateValue.getDate() - 1);
		// Get new copy of options in order the date picker detect change
		let copy: IMyOptions = this.getCopyOfOptions(this.endDateOptions);
		copy.disableUntil = {
			year: dateValue.getFullYear(),
			month: dateValue.getMonth() + 1,
			day: dateValue.getDate()
		};
		this.endDateOptions = copy;
	}

	//End date select
	public onEndDateChanged(event: IMyDateModel) {
		if (!event.jsdate) {
			return;
		}
		// console.log('onEndDateChanged(): ', event);
		let dateValue: Date = new Date(event.jsdate.getTime());
		// set next of selected date
		dateValue.setDate(dateValue.getDate() + 1);
		// Get new copy of options in order the date picker detect change
		let copy: IMyOptions = this.getCopyOfOptions(this.startDateOptions);
		copy.disableSince = {
			year: dateValue.getFullYear(),
			month: dateValue.getMonth() + 1,
			day: dateValue.getDate()
		};
		this.startDateOptions = copy;
	}
	public getCopyOfOptions(options): IMyOptions {
		return JSON.parse(JSON.stringify(options));
	}

	/**
  * Get All Category
  */
	getAllCategory() {
		this.homeService.getCategoryAPI()
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.temp = data['data'];
					data['data'].forEach((elem, i) => {
						this.dropdownList.push({ "id": elem.id, "itemName": elem.name });
					});
				} else {
					this.msg = data['message']
				}

			}
			);
	}
	/**
	 * Get All States
	 */
	getAllStates() {
		this.StatecityServices.getStateAPI()
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.statesArray = data['data'];
				} else {
					this.msg = data['message']
				}
			}
			);
	}

	/**
	* Get All jobs where bid by user
	* @param userId 
	* Function:getOpenJobDetailsByUserId
	* Date:
	* Description:Get All  open jobs  details
	*/
	getSearchEmployeeJobsByUserId(userId: any) {
		this.spinner.start();
		this.jobService.getSearchEmployeeJobs(userId)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.jobsArray = data['data'];
					this.jobMsg = '';
					this.jobsArray.forEach((job, i) => {
						this.shareBaseUrl[i] = this.urlShare + "viewJobDetails/" + job['job_id'];
					});
				} else {
					this.msgClass = 'error-message';
					this.jobMsg = data['message'];
				}
			},
			error => {
				// console.log(error);
			});
	}


	/**
	 * Check if user have documents
	 * document count
	 */
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
	 * Get Job details
	 * @param jobId 
	 * Function:getJobDetailsById
	 * Date:
	 * Description:Get job  details
	 */
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
					this.totalWage = this.jobs['total_wage'];
					this.wageType = this.jobs['wage_type'];
				} else {
					if (data['status'] == 'success') {
						this.msg = data['message'];
					} else {
						this.msg = data['message'];
					}
				}
			}
			);
	}

	/**
	 * Post Bid Details
	 * and check max job details
	 */
	postBidData(formData: any, bidform: NgForm) {
		if (Number(formData['bid_value']) > Number(this.maxBidValue) || Number(formData['bid_value']) < this.buyerCost) {
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
		this.spinner.start();
		this.jobService.placeUserBid(formData)
			.subscribe(
			data => {
				this.spinner.stop();
				this.getSearchEmployeeJobsByUserId(this.userId);
				if (typeof data['data'] !== 'undefined') {
				} else {
					if (data['status'] == 'success') {
						bidform.resetForm();
						this.msgClass = 'success-message';
						this.bidMsg = data['message'];
						setTimeout(() => {
							this.bidMsg = '';
							this.closebidbox.nativeElement.click();
						}, 500);
					} else {
						this.msgClass = 'error-message';
						this.bidMsg = data['message'];
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
		this.spinner.start();
		this.jobService.placeUserBid(formData)
			.subscribe(
			data => {
				this.spinner.stop();
				this.getSearchEmployeeJobsByUserId(this.userId);
				if (typeof data['data'] !== 'undefined') {
				} else {
					if (data['status'] == 'success') {
						this.msg = '';
					} else {
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
	setBidValue: any;
	setVal(buyer_cost: any, job_id: any) {
		//Set details which going to be accept or delete  
		this.setBidValue = {};
		this.setBidValue['bid_value'] = buyer_cost;
		this.applyBidData(this.setBidValue, job_id);
	}

	/**
	 * Search data
	 */
	searchJobData(searchFormData: any) {

		let formArray: any = [];
		if (typeof searchFormData['startdate'] == 'undefined') {
			searchFormData['startdate'] = '';
		} else {
			searchFormData['startdate'] = searchFormData['startdate']['formatted'];
		}
		if (typeof searchFormData['enddate'] == 'undefined') {
			searchFormData['enddate'] = '';
		} else {
			searchFormData['enddate'] = searchFormData['enddate']['formatted'];
		}
		searchFormData['user_id'] = this.userId;
		searchFormData['category_id'].forEach((elem, i) => {
			formArray.push(elem.id);
		});

		searchFormData['category_id'] = [];
		searchFormData['category_id'] = formArray;

		this.spinner.start();
		this.jobService.searchEmployeeJobsByFilter(searchFormData)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					window.scrollTo(0, 0);
					this.jobsArray = data['data'];
					this.jobMsg = '';
					this.jobsArray.forEach((job, i) => {
						this.shareBaseUrl[i] = this.urlShare + "viewJobDetails/" + job['job_id'];
					});
				} else {
					window.scrollTo(0, 0);
					this.jobsArray = [];
					this.msgClass = 'error-message';
					this.jobMsg = data['message'];
				}
			},
			error => {
				// console.log(error);
			});
	}

	/**
	 * Cancle bid model form
	 */
	cancleForm(form: any) {
		form.resetForm();
		this.bidMsg = '';
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
}
