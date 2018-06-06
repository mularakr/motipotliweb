import { Component, AfterViewInit, Input, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute, Params, NavigationCancel } from '@angular/router';
import { UserServices } from '../register/services/user.service';
import { User } from '../register/models/user';
import { JobServices } from '../postjob/services/job.service';
import { Job } from '../postjob/models/job';
import { ViewChild, ElementRef } from '@angular/core';
import { URLSearchParams, } from '@angular/http';
import { NgForm } from '@angular/forms';
import { SpinnerService } from '../spinner/spinner.service';
import { Shared, SharedModel } from '../services/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-paymentStatus',
	templateUrl: './paymentStatus.component.html',
	providers: [UserServices, JobServices],
})
export class PaymentStatusComponent implements OnInit {

	users: User;
	jobs: Job[];
	response: any;
	loading = false;
	msg: any;
	valid: string;
	dataArray: string;
	userId: string;
	dologin: boolean = false;

	msgClass: string;

	constructor(private meta: Meta, private sharedservice: Shared, private cookieService: CookieService, private spinner: SpinnerService, private userServices: UserServices, private jobService: JobServices, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef) {
		this.meta.addTags([{ name: 'payment-status', content: 'Check User payment status.' }]);
	}

	ngOnInit() {

		this.userId = this.cookieService.get('userId');
		if (!this.userId) {
			this.dologin = false;
			this.router.navigate([''])
		} else {

			this.route.params.subscribe(params => {
				let code = params['txnid'];
				if (!code) {
					this.router.navigate(['']);
				} else {
					this.checkUserPaymentTransactionStatus(code);
				}
			});
		}

	}

	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};

	/**
	 * check User Payment Status
	 * Get Details From job mark complete table 
	 * @function : checkUserPaymentStatus
	 * @argument txnid
	 * @returns 
	 */
	checkUserPaymentTransactionStatus(txnid: any) {
		this.spinner.start();
		this.jobService.app_paymentTransactionStatus(txnid)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {

					this.dataArray = data['data'];
					let job_complete_id = this.dataArray['PaymentHistory']['job_complete_id'];
					if (this.dataArray['PaymentHistory']['status'] == 'failure') {
						this.msgClass = 'error-message';
						this.msg = 'There is something wrong with the payment. Please try again';
						setTimeout(() => {
							this.msg = null;
							this.router.navigate(['/makePayment/' + job_complete_id]);
						}, 5000);

					} else if (this.dataArray['PaymentHistory']['status'] == 'success') {
						this.msgClass = 'success-message';
						this.msg = 'You Have Successfully Made The Payment';
						setTimeout(() => {
							this.msg = null;
							this.router.navigate(['/openJob']);
						}, 5000);

					} else {
						this.msgClass = 'error-message';
						this.msg = 'There is something wrong with the payment. Please try again';
						setTimeout(() => {
							this.msg = null;
							this.router.navigate(['/makePayment/' + job_complete_id]);
						}, 5000);
					}
				} else {
					if (data['status'] == 'success') {
						this.msg = data['message'];
					} else {
						this.msgClass = 'error-message';
						this.msg = data['message'];
						setTimeout(() => {
							this.msg = null;
							this.router.navigate(['']);
						}, 5000);
					}
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
