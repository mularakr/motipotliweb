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
import { IMyDrpOptions, IMyDateRangeModel, IMyDateRange, IMyInputFieldChanged, IMyCalendarViewChanged, IMyDateSelected } from 'mydaterangepicker';
import { DatePipe } from '@angular/common';
import { Shared, SharedModel } from '../services/shared.service';
import { environment } from "../../../environments/environment";
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-bookedJob',
	templateUrl: './bookedJob.component.html',
	providers: [JobServices, CompanyServices],
})
export class BookedJobComponent implements OnInit {
	@ViewChild('fileInput') fileInput: ElementRef;
	companies: Company[];
	jobs: Job[];
	userId: string;
	msg: string;
	dataArray: any[];
	currentJobId: string;
	modelDateArray: any = {};
	msgClass: string;
	setMessage: string;
	markJobListArray: any;
	titleofJob: any;
	p: number = 1;
	dateArray: any = {};
	las: any;
	paymentMsg: any;
	paymentArray: any;
	paymentFlag: any = 2;
	PayId: any;
	setBidValue: any;
	registeredUser: any;
	@ViewChild('message') message: ElementRef;
	@ViewChild('closeBtn') closeBtn: ElementRef;
	@ViewChild('closeFilte') closeFilte: ElementRef;
	@ViewChild('closeBtnMsg') closeBtnMsg: ElementRef;
	msgErr: any;
	urlShare: string;
	shareBaseUrl: any = [];
	/**
	 * Date picker options
	 */
	myDateRangePickerOptions: IMyDrpOptions = {
		// other options...
		dateFormat: 'dd-mm-yyyy', //yyyy-mm-dd
		firstDayOfWeek: 'mo',
		sunHighlight: true,
		inline: true,
		showClearBtn: true,
	};
	myForm: FormGroup; //form group name 
	employeeMessageForm: FormGroup;
	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private sharedservice: Shared, private cookieService: CookieService, private companyServices: CompanyServices, private jobService: JobServices, private spinner: SpinnerService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private renderer: Renderer2, private meta: Meta) {
		this.myForm = this.fb.group({
			myDateRange: ['', Validators.required]
		});

		this.employeeMessageForm = this.fb.group({
			'employee_id': ['', Validators.required],
			'message': ['', Validators.required],
		});


		this.urlShare = environment.shareBaseUrl;
		this.meta.addTags([{ name: 'BookedJob', content: 'List all booked job of the current employer.' }]);
	}
	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() {
		this.userId = this.cookieService.get('userId');
		if (!this.userId) {
			this.router.navigate([''])
		}
		if (this.userId) {
			this.getBookedJobDetailsByUserId(this.userId);
			this.getCompanyDetailByUserId(this.userId);
		}
		this.modelDateArray.start = '--/--/----';
		this.modelDateArray.end = '--/--/----';
	}

	ngOnDestroy() {
		this.fileInput.nativeElement.click();
		this.closeFilte.nativeElement.click();
		this.closeBtnMsg.nativeElement.click();
	}

	/**
	 * Respond after Angular initializes the component's views and child views
	 */
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};
	/**
	 * Get All Job details related to current user
	 * @param userId 
	 * Function:getBookedJobDetailsByUserId
	 * Date:
	 * Description:Get All  Booked jobs  details
	 */
	getBookedJobDetailsByUserId(uId: any) {
		this.spinner.start();
		this.jobService.getBookedJobs(uId)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.jobs = data['data'];
					this.jobs.forEach((job, i) => {
						this.shareBaseUrl[i] = this.urlShare + "viewJobDetails/" + job['job_id'];
					});
				} else {
					if (data['status'] == 'success') {
						this.msg = data['message'];
					} else {
						this.msgClass = 'error-message';
						this.msg = data['message'];
					}
				}
			}
			)
	}

	/**
	 * Get all city based on selected state
	 */

	onSelect(companyId: any) {
		if (companyId != '') {
			this.spinner.start();
			this.jobService.getBookedJobByCompanyId(companyId, this.userId)
				.subscribe(
				data => {
					this.spinner.stop();
					if (typeof data['data'] !== 'undefined') {
						this.jobs = data['data'];
					} else {
						if (data['status'] == 'success') {
						} else {
							this.jobs = null;
							this.msg = data['message'];
							this.msgClass = 'error-message';
						}
					}
				}
				)
		}
		else {
			this.getBookedJobDetailsByUserId(this.userId);
		}
	}


	/**
	 * Get All company details related to current user
	 * @param userId 
	 * 
	 */
	getCompanyDetailByUserId(userId: any) {
		this.companyServices.getUserCompany(userId)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.companies = data['data'];
				} else {
					if (data['status'] == 'success') {
					} else {
					}
				}
			}
			)
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
	/**
	 * Clear date range if seleted 
	 */
	clearDateRange(): void {
		// Clear the date range using the patchValue function
		this.myForm.patchValue({ myDateRange: '' });
	}

	/**
	 * On Change date function if user change the date
	 */
	onDateRangeChanged(event: IMyDateRangeModel) {

		if (event.formatted != '') {
			let date = event.formatted;
			var begin = event.formatted.split(" ")[0];
			var end = event.formatted.split(" ")[2];
			this.modelDateArray.start = begin;
			this.modelDateArray.end = end;
			this.dateArray['start'] = begin;
			this.dateArray['end'] = end;
			this.getBookedJobDetailsByCalendar(this.dateArray);
		}
		else {

			var date = new Date();
			this.getBookedJobDetailsByUserId(this.userId);
			this.modelDateArray.start = '--/--/----';
			this.modelDateArray.end = '--/--/----';

		}



	}

	/**
	 * Get Jobs details by calendar date
	 * @param: dateArray
	 */
	getBookedJobDetailsByCalendar(dateAray: any) {
		dateAray['user_id'] = this.userId;
		if (dateAray != '') {
			this.spinner.start();
			this.jobService.getBookedJobsByCalendar(dateAray)
				.subscribe(
				data => {
					this.spinner.stop();
					if (typeof data['data'] !== 'undefined') {
						this.jobs = data['data'];
					} else {
						if (data['status'] == 'success') {
						} else {
							this.jobs = null;
							this.msgClass = 'error-message';
							this.msg = data['message'];

						}
					}
				}
				)
		} else {
			this.getBookedJobDetailsByUserId(this.userId);
		}

	}

	/**
	 * Get Job details
	 * @param jobId ,user_id
	 * Function:checkUserPaymentStatusForCurrentJob
	 * Date:
	 * Description:Get job payment details
	 */
	checkUserPaymentStatusForCurrentJob(jobId: any, user_id: any) {
		this.jobService.app_checkEmployerPaymentStatusForCurrentJob(jobId, user_id)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.paymentArray = data['data'];
					this.paymentFlag = this.paymentArray['payment_flag'];
					this.PayId = this.paymentArray['id'];
				} else {
					if (data['status'] == 'success') {
						this.paymentMsg = data['message'];
					} else {
						this.paymentArray = [];
						this.paymentMsg = data['message'];
					}
				}
			}
			)
	}




	/**
	 * Get All employee list who mark job as complete 
	 */
	getMarkJobEmployeeList(jobId: any, title: any) {
		this.titleofJob = title;
		this.jobService.getMarkJobEmployeeList(jobId)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.markJobListArray = data['data'];
					this.checkUserPaymentStatusForCurrentJob(jobId, this.userId);
					this.setMessage = '';
					//Get data Details
				} else {
					if (data['status'] == 'success') {
					} else {
						this.markJobListArray = null;
						this.msgClass = 'error-message';
						this.setMessage = data['message'];

					}
				}

			});
	}

	/**
	   * Mark job as complete Code
	   * @argument JobId
	   * @returns  status
	   */

	//We change the process of job accepted now we are sending employer to payment page with job details 
	//['/viewJob/'+job.job_id]
	markJobComplete(JobId: any, status: any) {
		let makeArray: any = {};
		makeArray['user_id'] = '';
		makeArray['jobId'] = JobId;
		makeArray['status'] = status;
		this.spinner.start();
		this.jobService.updateJobMarkComplete(makeArray)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
				} else {
					if (data['status'] == 'success') {
						//close model box
						this.fileInput.nativeElement.click();
					} else {
						//close model box
						this.fileInput.nativeElement.click();
					}
				}
			}
			);

	}

	/**
	 * bidAcceptReject 
	 * send message to Employer if job accepted or reject
	 */
	sendMessageEmployer(formData: any, formJob: NgForm) {

		formData['job_id'] = this.setBidValue;
		formData['from_id'] = '';
		formData['login_type'] = 'employee'; //message send to employee 
		this.spinner.start();
		this.jobService.sendMessage(formData)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {

				} else {
					if (data['status'] == 'success') {
						window.scroll(0, 0);
						this.setBidValue = null;
						this.message.nativeElement.value = null;
						this.msgClass = 'success-message';
						this.msgErr = data['message'];
						setTimeout(() => {
							this.msgErr = null;
							this.closeBtn.nativeElement.click();
						}, 2000);
					} else {
					}
				}
			}
			);
	}


	/**
	 * Set details which going to be accept or delete
	 */
	setVal(job_id: any, employer_id: any) {
		//Set details which going send msg
		this.getAllRegisteredEmployeeForJob(job_id);
		this.setBidValue = job_id;
	}
	/**
	 * Get All registered User for current job
	 * getAllRegisteredUser(id)
	 */
	getAllRegisteredEmployeeForJob(jobIdForCurrent: any) {
		this.jobService.getRegisteredEmployeeUserForMessage(jobIdForCurrent)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.registeredUser = data['data'];
				} else {
					if (data['status'] == 'success') {

					} else {
						this.registeredUser = [];
					}
				}
			}
			)
	}

	cancleModel() {
		this.message.nativeElement.value = null;
		this.msgErr = '';
	}
}//end class
