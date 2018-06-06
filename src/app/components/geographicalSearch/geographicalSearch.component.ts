import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
import { Meta } from '@angular/platform-browser';
@Component({
	selector: 'app-geographical',
	templateUrl: './geographicalSearch.component.html',
	providers: [JobServices, StatecityServices, HomeServices, UserServices],
})
export class GeographicalSearchComponent implements OnInit {

	homes: Home[];
	states: State[];
	temp: any;
	msg: any;
	statesArray: any;
	errormsg: string;
	searchForm: FormGroup; //Form 
	userId: string; //user Id
	loginType: any; // get user login type
	urlShare: string;
	shareBaseUrl: any = [];
	geoForm: FormGroup;
	geoSearchBidForm: FormGroup;
	cityArray: any;
	isUserLoggedIn: any;
	imageUrl: any;
	getArray: any = [];
	jobsArray: any;
	jobMsg: any;
	msgClass: string;
	myArray: any;
	docCount: any;
	jobs: any;
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
	@ViewChild('closeBtn') closeBtn: ElementRef;
	@ViewChild('maxValue') maxValue: ElementRef;
	@ViewChild('closebidbox') closebidbox: ElementRef;

	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private meta: Meta, private sharedservice: Shared, private StatecityServices: StatecityServices, private homeService: HomeServices, private cookieService: CookieService, private jobService: JobServices, private spinner: SpinnerService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private userServices: UserServices) {

		this.geoForm = this.fb.group({
			'searchKey': [''],
			'city_id': [''],
			'category_id': [''],
		});

		//Bid Form 
		this.geoSearchBidForm = this.fb.group({
			'bid_value': ['', Validators.required],
		});

		this.urlShare = environment.shareBaseUrl;
		this.sharedservice.userLoginType.subscribe(
			data => {
				this.loginType = data;
			}
		);
		this.meta.addTags([{ name: 'geographical-search', content: 'Geographical Search functionalities to search jobs based on location, categories and keywords.' }]);
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
			if (this.userId != null && this.userId != '') {
				this.checkUserDocFile(this.userId);
			}
		} else {

			this.loginType = null;
			this.userId = null;
		}
		window.scroll(0, 0);
		//Get Search value from session 
		this.getArray = sessionStorage.getItem('geo_search');
		if (this.getArray) {
			//pass value to function for search
			this.searchGeographicalData(this.getArray);
			//remove value from session
		} else {

			this.router.navigate(['']);
		}
		this.getAllCategory();
		this.getAllStates();
		this.getAllPopularCities();
	}
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};

	/**
	 * Get All States
	 */
	getAllPopularCities() {
		this.spinner.start();
		this.StatecityServices.getPopularCity()
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.cityArray = data['data'];
				} else {
					if (data['status'] == 'success') {
					} else {
					}
				}
			}
			)
	}
	/**
	 * Get All Category
	 */
	getAllCategory() {
		this.spinner.start();
		this.homeService.getCategoryAPI()
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.temp = data['data'];
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
		this.spinner.start();
		this.StatecityServices.getStateAPI()
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.statesArray = data['data'];
				} else {
					this.msg = data['message']
				}
			}
			);
	}

	/**
	 * Search data by category,state,text
	 */
	searchGeographicalData(formData: any) {
		this.spinner.start();
		this.jobService.searchGeographicalData(formData)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					let id = this.userId;
					let myArray: any = [];
					//If user loggedin set job filter				
					if (this.userId != '') {
						this.jobsArray = data['data'];
						this.jobsArray.forEach(function (word) {
							if (word.user_id !== id) {
								myArray.push(word);
							}
						});
					} else {
						myArray = data['data'];
					}
					this.jobsArray = myArray;
					this.jobMsg = '';
					this.jobsArray.forEach((job, i) => {
						this.shareBaseUrl[i] = this.urlShare + "viewJobDetails/" + job.job_id
					});
				} else {
					if (data['status'] == 'success') {
						this.jobMsg = data['message'];
					} else {

						this.msgClass = 'error-message';
						this.jobMsg = data['message'];
						this.jobsArray = null;
					}
				}
			},
			error => {
				// console.log(error);
			});
	}

	/**
	 * Get geographical Search form data
	 */
	geoFormData(formData: any) {
		formData["flag"] = '1';
		this.closeBtn.nativeElement.click();
		sessionStorage.setItem('geo_search', JSON.stringify(formData));
		this.getArray = sessionStorage.getItem('geo_search');
		this.searchGeographicalData(this.getArray);
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
				this.searchGeographicalData(this.getArray);
				if (typeof data['data'] !== 'undefined') {
				} else {
					if (data['status'] == 'success') {
						bidform.resetForm();
						this.msgClass = 'success-message';
						this.bidMsg = data['message'];
						setTimeout(() => {
							this.bidMsg = '';
							this.closebidbox.nativeElement.click();
						}, 2500);
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
				this.searchGeographicalData(this.getArray);
				if (typeof data['data'] !== 'undefined') {
				} else {
					if (data['status'] == 'success') {
						this.msg = '';
					} else {
						//console.log(data['message']);				
					}
				}
			},
			error => {
				console.log(error);
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
