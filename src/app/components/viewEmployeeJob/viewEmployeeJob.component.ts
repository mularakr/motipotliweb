import { Component, AfterViewInit, Input, Output, OnInit, trigger, state, style, ChangeDetectorRef, ChangeDetectionStrategy, transition, animate, Renderer2 } from '@angular/core';
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
import { environment } from "../../../environments/environment"; @Component({
	selector: 'app-viewEmployeeJob',
	templateUrl: './viewEmployeeJob.component.html',
	providers: [JobServices, CompanyServices, UserServices],
})
export class ViewEmployeeJobComponent implements OnInit {
	@ViewChild('maxValue') maxValue: ElementRef;
	@ViewChild('closebidbox') closebidbox: ElementRef;
	@ViewChild('confirmJobApplyModel') confirmJobApplyModel: ElementRef;
	@ViewChild('closConfirmDilog') closConfirmDilog: ElementRef;
	@ViewChild('closeConfirm') closeConfirm: ElementRef;


	companies: Company[];
	jobs: Job[];
	userId: string;
	login_type: string;
	msg: string;
	dataArray: any[];
	currentJobId: any;
	open: any;
	bidDetails: any[];
	acceptBidDetails: any[];
	imageArray: any[];
	bidStatus: any;
	jobID: any;
	bidForm: FormGroup;
	modelArray: any;
	bidMsg: any;
	maxBidValue: any;
	bidDetailsArray: any;
	setBidValue: any = [];
	msgClass: string;
	msgErr: any;
	myBidButtonStatus: string;
	@ViewChild('message') message: ElementRef;
	@ViewChild('closeBtn') closeBtn: ElementRef;
	urlShare: string;
	shareBaseUrl: any;
	paymentConfirmForm: FormGroup;
	divFlag = '0';
	jobcost: any;
	buyerCost: any;
	idProof: any;
	docMsg: any;
	jobBookedStatus: number;
	shareBaseUrl1: any;
	shareTitle: any;
	shareDesc: any;
	totalWage: any;
	wageType: any;
	ratingMsg: any;
	ratingDetails: any;
	ratingFlag: any;
	paymentMsg: any;
	paymentArray: any;
	paymentFlag: any;
	PayId: any;
	messageData = {};
	confmsg: any;
	cancleBtn: any;
	docCount: any;
	setMessageValue: any = [];
	selectedImage: any;
	paymentIdforUpdate: any;
	applyMsgbox: any;
	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private sharedservice: Shared, private cookieService: CookieService, private companyServices: CompanyServices, private jobService: JobServices, private spinner: SpinnerService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private renderer: Renderer2, private userServices: UserServices) {
		this.bidForm = this.fb.group({
			'bid_value': ['', Validators.required],
			'job_id': [''],
			'user_id': [''],
		});

		this.paymentConfirmForm = this.fb.group({
			'caseForm': ['', Validators.required],
		});

		this.urlShare = environment.shareBaseUrl;
	}
	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() {
		//get job id from url 
		this.userId = this.cookieService.get('userId');
		this.route.params.subscribe(params => {
			this.currentJobId = params['job_Id'];
			this.getJobDetailsById(this.currentJobId);
			this.checkUserDocFile(this.userId);
			this.getUserRatingForCurrentJobDetails(this.currentJobId, this.userId);
			this.checkUserPaymentStatusForCurrentJob(this.currentJobId, this.userId);
		});
		if (!this.userId) {
			this.router.navigate([''])
		}
	}

	/**
	 * Respond after Angular initializes the component's views and child views
	 */

	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};


	/**
	   * Check if user have documents
	   * document count
	   */
	checkUserDocFile(user_id: any) {
		this.spinner.start();
		this.userServices.getUserDocDetails(user_id)
			.subscribe(
			data => {
				this.spinner.stop();
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
		this.spinner.start();
		this.jobService.getJobDetails(jobId)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.msgClass = 'error-message';
					this.jobs = data['data'];
					this.imageArray = this.jobs['imageArray'];
					this.maxBidValue = this.jobs['allowbid_cost'];
					this.buyerCost = this.jobs['buyer_cost'];
					this.jobcost = this.jobs['jobcost'];
					this.jobBookedStatus = this.jobs['job_status'];
					this.idProof = this.jobs['idproof'];
					this.shareTitle = this.jobs['title'];
					this.shareDesc = this.jobs['description'];
					this.totalWage = this.jobs['total_wage'];
					this.wageType = this.jobs['wage_type'];
					this.getUserBidDetails(this.currentJobId, this.userId);
					this.divFlag = '1';
				} else {
					if (data['status'] == 'success') {
						this.msg = data['message'];
					} else {
						this.msg = data['message'];
					}
				}
				this.shareBaseUrl1 = this.urlShare + "viewJobDetails/" + this.jobs['job_id'];
			}
			)
	}


	/**
	 * Get Job details
	 * @param jobId ,user_id
	 * Function:getJobBidDetails
	 * Date:
	 * Description:Get job  details
	 */
	getUserBidDetails(jobId: any, user_id: any) {
		this.jobService.getUserBidDetails(jobId, user_id)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.bidDetails = data['data'];
					if (this.bidDetails[data['data'].length - 1].status == 0) {
						this.cancleBtn = 'true';
					} else {
						this.cancleBtn = 'false';
					}
					// 0 pending/ 1 accept/ 2 reject/3 filled
					if (this.bidDetails[data['data'].length - 1].status == 0 ||
						this.bidDetails[data['data'].length - 1].status == 1 ||
						this.bidDetails[data['data'].length - 1].status == 3) {
						this.myBidButtonStatus = 'false';
					} else {
						this.myBidButtonStatus = 'true';
					}

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
	 * Post Bid Details
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
	 * Send Bid for jobs
	 */
	saveBidData(formData: any, bidform: NgForm) {

		this.bidMsg = '';
		formData['user_id'] = this.userId;
		formData['job_id'] = this.currentJobId;
		this.spinner.start();
		this.jobService.placeUserBid(formData)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.bidDetailsArray = data['data'];
				} else {
					if (data['status'] == 'success') {
						this.msgClass = 'success-message';
						this.confmsg = data['message'];
						bidform.resetForm();
						this.getUserBidDetails(this.currentJobId, this.userId);
						this.msg = '';
						setTimeout(() => {
							this.confmsg = '';
							this.closebidbox.nativeElement.click();
						}, 2000);

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

	applyBidData(formData: any) {

		this.bidMsg = '';
		formData['user_id'] = this.userId;
		formData['job_id'] = this.currentJobId;
		this.spinner.start();
		this.jobService.placeUserBid(formData)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.bidDetailsArray = data['data'];
				} else {
					if (data['status'] == 'success') {
						window.scroll(0, 0);
						this.getUserBidDetails(this.currentJobId, this.userId);
						this.msg = '';
						this.msgClass = 'success-message';
						this.applyMsgbox = data['message'];
						this.confirmJobApplyModel.nativeElement.click();

						setTimeout(() => {
							this.applyMsgbox = '';
							this.closConfirmDilog.nativeElement.click();
						}, 2000);

					} else {
						window.scroll(0, 0);
						this.msgClass = 'error-message';
						this.applyMsgbox = data['message'];
						this.bidMsg = data['message'];
						this.confirmJobApplyModel.nativeElement.click();
						setTimeout(() => {
							this.applyMsgbox = '';
							this.closConfirmDilog.nativeElement.click();
						}, 2000);
					}
				}
			},
			error => {
				// console.log(error);
			});

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
	* 
	* check MAX bud for current job
	*/
	checkMaxCost(eventValue: any) {
		if (this.maxValue.nativeElement.value != '') {
			if (Number(eventValue.target.value) > Number(this.maxBidValue) || Number(eventValue.target.value) < this.buyerCost) {

				eventValue.target.focus();
				this.maxValue.nativeElement.value = null;
				this.bidMsg = 'You can not enter grater value then Max Allowed Bid Cost ' + this.maxBidValue + ' and less then ' + this.buyerCost;
			}
			else {
				this.bidMsg = '';
			}
		}
	}

	/**
	 * Cancle bid model form
	 */
	cancleForm(form: any) {
		form.resetForm();
		this.bidMsg = '';
	}

	/**
	 * bidAcceptReject
	 */
	sendMessageEmployer(message: string) {
		if (message == '') {
			this.msgClass = 'error-message';
			this.msgErr = 'Please enter your message';
		} else {
			this.msgErr = '';
			this.messageData['job_id'] = this.setMessageValue.job_id;
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
	 * Get Job details
	 * @param jobId ,user_id
	 * Function:getJobBidDetails
	 * Date:
	 * Description:Get job  details
	 */
	getUserRatingForCurrentJobDetails(jobId: any, user_id: any) {
		this.jobService.app_UserRatingForCurrentJobDetails(jobId, user_id)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.ratingDetails = data['data']['jobRating'];
					this.ratingFlag = data['data']['flag'];
					this.ratingMsg = null;
				} else {
					if (data['status'] == 'success') {
						this.ratingMsg = data['message'];
					} else {
						this.ratingMsg = data['message'];
					}
				}
			}
			)
	}


	/**
	  * Get Job details
	  * @param jobId ,user_id
	  * Function:checkUserPaymentStatusForCurrentJob
	  * Date:
	  * Description:Get job payment details
	  */
	checkUserPaymentStatusForCurrentJob(jobId: any, user_id: any) {
		this.jobService.app_checkUserPaymentStatusForCurrentJob(jobId, user_id)
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

	confirmPayment(formData: any) {
		this.paymentFlag = 1;
		formData['user_id'] = this.userId;
		formData['job_id'] = this.currentJobId;
		formData['payment_id'] = this.paymentIdforUpdate;
		this.spinner.start();
		this.jobService.app_confirmPaymentByEmployee(formData)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.closeConfirm.nativeElement.click();
				} else {
					if (data['status'] == 'success') {
						this.closeConfirm.nativeElement.click();
					} else {
						this.closeConfirm.nativeElement.click();
					}
				}
			}
			)

	}

	setPaymentId(pId: any) {
		this.paymentIdforUpdate = pId;
	}
	/**
	 * Set details which going to be accept or delete
	 */
	setMessageVal(job_id: any, employer_id: any) {
		//Set details which going to be accept or delete
		this.setMessageValue['job_id'] = job_id;
	}
	cancleModel() {
		this.message.nativeElement.value = null;
		this.msgErr = '';
	}

	/**
	 * Set details which going to be accept or delete
	 */
	setVal(buyer_cost: any) {
		//Set details which going to be accept or delete  
		this.setBidValue = {};
		this.setBidValue['bid_value'] = buyer_cost;
		this.applyBidData(this.setBidValue);
	}

	/**
	 * Cancle bid model form
	 */
	cancleConfirmForm(form: any) {
		form.resetForm();
	}


	setSelectedImage(image) {
		this.selectedImage = image;
	}
	/**
	 * Cancel last bid
	 */
	cancelLastBid() {

		let formData = new FormData();
		formData['bidId'] = this.bidDetails[this.bidDetails.length - 1].bid_id;
		formData['userId'] = this.userId;
		formData['jobId'] = this.currentJobId;

		this.spinner.start();
		this.jobService.cancleLastBid(formData)
			.subscribe(
			data => {
				if (data['status']) {
					this.cancleBtn = 'false';
					this.spinner.stop();
					this.bidDetails = [];
					this.myBidButtonStatus = 'true';
					this.getUserBidDetails(this.currentJobId, this.userId);
				}
			},
			error => {
					//console.log(error),
			}
		)
	}

}//end class
