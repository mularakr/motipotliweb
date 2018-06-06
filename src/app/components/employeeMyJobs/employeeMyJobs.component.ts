import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnInit, OnDestroy, trigger, state, style, transition, animate } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { JobServices } from '../postjob/services/job.service';
import { Job } from '../postjob/models/job';
import { StatecityServices } from '../register/services/statecity.service';
import { UserServices } from '../register/services/user.service';
import { State } from '../register/models/state';
import { City } from '../register/models/city';
import { User } from '../register/models/user';
import { SpinnerService } from '../spinner/spinner.service';
import { CookieService } from 'ngx-cookie-service';
//DatePicker
import { IMyDrpOptions, IMyDateRangeModel, IMyDateRange, IMyInputFieldChanged, IMyCalendarViewChanged, IMyDateSelected } from 'mydaterangepicker';
import { DatePipe } from '@angular/common';
import { Shared, SharedModel } from '../services/shared.service';
import { environment } from "../../../environments/environment";
import { MessagingService } from "../messaging/messaging.service";
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-employeeMyJobs',
	templateUrl: './employeeMyJobs.component.html',
	providers: [StatecityServices, UserServices, JobServices, DatePipe],
})
export class EmployeeMyJobsComponent implements OnInit {
	@ViewChild('fileInput') fileInput;
	@ViewChild('closeDocBtn') closeDocBtn: ElementRef;
	states: State[];
	cities: City[];
	users: User;
	jobs: Job[];
	@Input() user;

	/**
	 * All Variable for this component
	 */
	msg: any;
	dataArray: any; //data details array
	jobsArray: any; //Job details array
	userId: string; //user Id
	loginType: any; // get user login type
	model: any = {}; // bind value to form
	email: any;		//set user email id
	jobMsg: any; // for job record not found or set msg 
	modelDateArray: any = {};
	delMsg: any;
	msgClass: string;
	job_button_status: any;
	@ViewChild('message') message: ElementRef;
	@ViewChild('closeBtn') closeBtn: ElementRef;
	@ViewChild('closeDoc') closeDoc: ElementRef;

	msgErr: any;
	urlShare: string;
	shareBaseUrl: any = [];
	p: number = 1;
	myJobsArray: any;
	dateArray: any = {};
	las: any;
	/**
	 * Date picker options
	 */
	myDateRangePickerOptions: IMyDrpOptions = {
		// other options...
		dateFormat: 'dd-mm-yyyy',//yyyy-mm-dd
		firstDayOfWeek: 'mo',
		sunHighlight: true,
		inline: true,
		showClearBtn: true,

	};
	//form group name 
	myForm: FormGroup;
	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private meta: Meta, private sharedservice: Shared, private cookieService: CookieService, private jobService: JobServices, private spinner: SpinnerService, private StatecityServices: StatecityServices, private userServices: UserServices, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private datePipe: DatePipe, private msgService: MessagingService) {
		this.myForm = this.fb.group({
			myDateRange: ['', Validators.required]
		});


		this.urlShare = environment.shareBaseUrl;
		this.meta.addTags([{ name: 'employee-jobs', content: 'list out employee jobs list.' }]);
	}
	/**
	   * ngOnInit called on demand by Angular
	   * initialising the component.
	   */
	ngOnInit() {

		this.userId = this.cookieService.get('userId');
		this.msgService.getPermission(this.userId);
		this.msgService.receiveMessage();
		this.loginType = this.cookieService.get('login_type');
		if (this.userId) {
			this.getUserDetailById(this.userId);
			this.getMyJobById(this.userId);
		}
		var date = new Date();
		this.modelDateArray.start = '--/--/----';
		this.modelDateArray.end = '--/--/----';
	}

	ngOnDestroy() {
		this.closeBtn.nativeElement.click();
		this.closeDoc.nativeElement.click();
		this.closeDocBtn.nativeElement.click();
	}

	/**
	   * Respond after Angular initializes the component's views and child views
	   */
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};

	/**
	 * Get user full details 
	 */
	getUserDetailById(userId: any) {
		this.userServices.getUserDetailById(userId)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data'];
				} else {
					this.msg = data['message']
				}
			},
			error => {
				// console.log(error);
			});
	}

	/**
	 * Get Job by Catagory
	 */
	getMyJobById(myId: any) {
		this.spinner.start();
		this.jobService.getEmployeeMyJobs(myId)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.jobsArray = data['data'];
					this.jobMsg = '';
				} else {
					this.jobsArray = [];
					this.msgClass = 'error-message';
					this.jobMsg = data['message'];
				}
				/**
				 * create url for share button
				 */
				this.jobsArray.forEach((job, i) => {
					this.shareBaseUrl[i] = this.urlShare + "viewJobDetails/" + job['job_id'];
				});
			},
			error => {
				// console.log(error);
			});
	}

	/**
	 * Date range function
	 */
	setDateRange(): void {
		// Set date range (today) using the patchValue function
		let date = new Date();
		this.myForm.patchValue({
			myDateRange: {
				beginDate: {
					year: date.getFullYear(),
					month: date.getMonth() + 1,
					day: date.getDate()
				},
				endDate: {
					year: date.getFullYear(),
					month: date.getMonth() + 1,
					day: date.getDate()
				}
			}
		});
	}

	clearDateRange(): void {
		// Clear the date range using the patchValue function
		this.myForm.patchValue({ myDateRange: '' });
	}

	/**
	 * On Change date function 
	 */
	onDateRangeChanged(event: IMyDateRangeModel) {

		if (event.formatted != '') {
			let dateStart = event.formatted.split(" ")[0];
			let dateEnd = event.formatted.split(" ")[2];
			this.modelDateArray.start = dateStart;
			this.modelDateArray.end = dateEnd;
			this.dateArray['start'] = dateStart;
			this.dateArray['end'] = dateEnd;
			this.getEmployeeJobsByCalendar(this.dateArray);

		} else {

			//Data search if user reset date range 
			var date = new Date();
			this.modelDateArray.start = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
			this.modelDateArray.end = this.modelDateArray.start;
			this.getMyJobById(this.userId);
		}
	}

	/**
	 * Get Jobs details by calendar date
	 */
	getEmployeeJobsByCalendar(dateAray: any) {
		dateAray['user_id'] = this.userId;
		if (dateAray != '') {
			this.spinner.start();
			this.jobService.getJobsForEmployeeByCalendar(dateAray)
				.subscribe(
				data => {
					this.spinner.stop();
					if (typeof data['data'] !== 'undefined') {
						this.jobsArray = data['data'];
						this.jobMsg = '';
					} else {
						if (data['status'] == 'success') {
						} else {
							this.jobsArray = null;
							this.msgClass = 'error-message';
							if (this.jobsArray == null) {
								this.jobMsg = 'No record found';
							} else {

								this.jobsArray.forEach((job, i) => {
									this.shareBaseUrl[i] = this.urlShare + "viewJobDetails/" + job['job_id'];
								});
							}
						}
					}
				}
				)
		} else {
			this.getMyJobById(this.userId);
		}
	}


	/**
	 * Mark job as complete Code
	 * @argument JobId
	 * @returns  status
	 */
	markJobComplete(isAgree: any) {
		let makeArray: any = {};
		if (isAgree == 'true') {
			this.spinner.start();
			makeArray['user_id'] = this.userId;
			makeArray['jobId'] = this.setMarkJobId;
			makeArray['status'] = '';

			//Find job and update the status
			this.jobsArray.forEach((job, i) => {
				if (job.job_id == this.setMarkJobId) {
					this.jobsArray[i]['buttonStatus'] = 'pending';
				}
			});
			this.closeDocBtn.nativeElement.click();
			this.jobService.updateJobMarkComplete(makeArray)
				.subscribe(
				data => {
					this.spinner.stop();
					if (typeof data['data'] !== 'undefined') {
						//Data Not comming
					} else {
						if (data['status'] == 'success') {
							// console.log(data['message']);						
						} else {
							// console.log(data['message']);
						}
					}
				}
				);

		} else {
			this.setMarkJobId = null;
		}
	}

	/**
	* Set details which going to be complete
	*/
	setMarkJobId: any;
	setMarkJobIndex: any;
	setMarkJobValue(id: any) {
		//Set details which going to be delete
		this.setMarkJobId = id;
	}

	/**
	 * Send message to employer if bid Accept/Reject
	 */
	messageData = {};
	sendMessageEmployer(message: string) {
		if (message == '') {
			this.msgClass = 'error-message';
			this.msgErr = 'Please enter your message';
		} else {
			this.msgErr = '';
			this.messageData['job_id'] = this.setBidValue.job_id;
			this.messageData['from_id'] = this.userId;
			this.messageData['login_type'] = 'employer'; //message send to employer 
			this.messageData['message'] = message;
			this.spinner.start();
			this.jobService.sendMessage(this.messageData)
				.subscribe(
				data => {
					this.spinner.stop();
					if (typeof data['data'] !== 'undefined') {

					} else {
						if (data['status'] == 'success') {

							this.msgClass = 'success-message';
							this.msgErr = data['message'];
							setTimeout(() => {
								this.msgErr = null;
								this.closeBtn.nativeElement.click();
								this.message.nativeElement.value = null;
							}, 2000);
						} else {
							this.msgErr = data['message'];
						}
					}
				}
				)
		}
	}

	/**
	* Set details which going to be accept or delete
	*/
	setBidValue: any = [];
	setVal(job_id: any, employer_id: any) {
		//Set details which going to be accept or delete
		this.setBidValue['job_id'] = job_id;
	}

	cancleModel() {
		this.message.nativeElement.value = null;
		this.msgErr = '';
	}
}