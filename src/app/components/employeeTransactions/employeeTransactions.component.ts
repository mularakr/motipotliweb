import { Component, AfterViewInit, Input, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute, Params, NavigationCancel } from '@angular/router';
import { UserServices } from '../register/services/user.service';
import { User } from '../register/models/user';
import { JobServices } from '../postjob/services/job.service';
import { CompanyServices } from '../postjob/services/company.service';
import { Job } from '../postjob/models/job';
import { ViewChild, ElementRef } from '@angular/core';
import { URLSearchParams, } from '@angular/http';
import { NgForm } from '@angular/forms';
import { SpinnerService } from '../spinner/spinner.service';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { IMyDpOptions, IMyDateModel, IMyOptions, IMyMarkedDates } from 'mydatepicker';
import { Shared, SharedModel } from '../services/shared.service';
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-employeeTransactions',
	templateUrl: './employeeTransactions.component.html',
	providers: [UserServices, JobServices, CompanyServices],
})
export class EmployeeTransactionsComponent implements OnInit {

	users: User;
	jobs: Job[];
	response: any;
	loading = false;
	msg: any;
	valid: string;
	dataArray: any;
	userId: string;
	dologin: boolean = false;
	msgClass: string;
	historySearchEmployeeForm: FormGroup;
	myclassTable: any;
	p: number = 1;
	//set placeholder in date inputbox
	public placeholder: string = 'Select start date';
	public placeholder1: string = 'Select end date';

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
	constructor(private meta: Meta, private sharedservice: Shared, private cookieService: CookieService, private companyServices: CompanyServices, private spinner: SpinnerService, private userServices: UserServices, private jobService: JobServices, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef) {
		this.historySearchEmployeeForm = this.fb.group({
			'startdate': [''],
			'enddate': [''],
		});
		this.meta.addTags([{ name: 'employee-transactions', content: 'List out employee transactions.' }]);
	}

	ngOnInit() {

		this.userId = this.cookieService.get('userId');
		if (!this.userId) {
			this.dologin = false;
			this.router.navigate([''])
		}
		this.getEmployeeTransactionHistory(this.userId);
	}

	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};

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
	 * check User Payment History 
	 * Get Payment Details 
	 * @function : getEmployerTransactionHistory
	 * @argument user_id
	 * @returns 
	 */
	getEmployeeTransactionHistory(userId: any) {
		this.spinner.start();
		this.jobService.app_getEmployeeTransactionHistory(userId)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data'];
					this.myclassTable = '';
					this.msg = '';
				} else {
					if (data['status'] == 'success') {
						this.msg = data['message'];
					} else {
						this.msgClass = 'error-message';
						this.msg = data['message'];
						this.myclassTable = 'abc';
					}
				}

			},
			error => {
				// console.log(error);
			});
	}


	/**
	 * Search history 
	 * @param formData 
	 * 
	 */
	searchEmployeeTransactionHistory(searchFormData: any) {
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
		this.spinner.start();
		this.jobService.searchEmployeeTransactionHistory(searchFormData)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data'];
					this.myclassTable = '';
					this.msg = '';
				} else {
					this.dataArray = [];
					this.msgClass = 'error-message';
					this.myclassTable = 'abc';
					this.msg = data['message'];
				}
			},
			error => {
				// console.log(error);
			});
	}
	cancelReset() {
		this.router.navigate(['']);
	}
}
