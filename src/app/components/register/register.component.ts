import { Component, AfterViewInit, Input, Output, OnInit, trigger, state, style, ChangeDetectorRef, ChangeDetectionStrategy, transition, animate, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StatecityServices } from './services/statecity.service';
import { UserServices } from './services/user.service';
import { State } from './models/state';
import { City } from './models/city';
import { User } from './models/user';
import { NgForm } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { SpinnerService } from '../spinner/spinner.service';
import { Shared, SharedModel } from '../services/shared.service';
import { ContentServices } from '../services/content.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from "../../../environments/environment";
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	providers: [StatecityServices, UserServices, ContentServices],
})

export class RegisterComponent implements OnInit {
	@ViewChild('signUpclose') signUpclose: ElementRef;
	@ViewChild('close') close: ElementRef;
	@ViewChild('confirmRegisterModelOpen') confirmRegisterModelOpen: ElementRef;
	@Output() res: EventEmitter<any> = new EventEmitter();
	//Model
	states: State[];
	cities: City[];
	users: User;
	@Input() user;
	@Input() alertMsg: any;
	addUserForm: FormGroup; //Form 
	errorMessage: String;
	response: any;
	loading = false;
	message: string;
	msg: any;
	dataArray: any;
	salt: any;
	AboutdataArray: any;
	Aboutmessage: any;
	aboutmydata: any;
	aboutmsgClass: any;
	myTermsdata: any;
	termsmessage: any;
	termdataArray: any;
	msgClass: any;
	confirmMsg: any;
	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private sanitizer: DomSanitizer, private sharedservice: Shared, private changeDetector: ChangeDetectorRef, private spinner: SpinnerService, private StatecityServices: StatecityServices, private userServices: UserServices, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private renderer: Renderer2, private contentServices: ContentServices, private cookieService: CookieService) {
		this.addUserForm = this.fb.group({
			'name': ['', Validators.required],
			'phone': ['', Validators.required],
			'state_id': ['', Validators.required],
			'city_id': ['', Validators.required],
			'email': ['', Validators.required],
			'password': ['', Validators.required],
			'term': ['', Validators.required],
		});
		this.salt = environment.passSalt;
	}

	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() {
		//Get All States
		this.getAllStates();
		this.getTermsDetails();
		this.sharedservice.changedHederContent.subscribe(
			(data) => {
				this.getAboutUsDetails(localStorage.getItem('about'));
			}
		);
	}
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};
	/**
	 * Get All States Details 
	 */
	getAllStates() {
		this.StatecityServices.getStateAPI()
			.subscribe(
			data => {
				this.states = data['data'];
			}
			);
	}

	/**
	 * Get City Details by state id on change
	 * param :  stateid
	 */
	onSelect(stateid) {
		this.spinner.start();
		this.StatecityServices.getCityAPI(stateid)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.cities = data['data'];
				} else {
					if (data['status'] == 'success') {
					} else {
						alert(data['message']);
					}
				}
			}
			)
	}

	/**
	 * user sign Up
	 * param :  formData
	 */
	signUpData(formData: any, form: NgForm) {
		this.spinner.start();
		let val = window.btoa(formData['password']);
		let salt = this.salt + '%' + val;
		formData['password'] = salt;
		this.userServices.signUpUser(formData)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data'];
				} else {
					if (data['status'] == 'success') {
						window.scroll(0, 0);
						form.resetForm();
						//reset register state and city
						let val = '';
						this.addUserForm.controls['state_id'].setValue(val);
						this.addUserForm.controls['city_id'].setValue(val);

						this.signUpclose.nativeElement.click();
						this.msgClass = 'success-message';
						this.confirmMsg = data['message'];
						this.confirmRegisterModelOpen.nativeElement.click();

					} else {

						this.msg = data['message'];
					}
				}
			},
			error => {
				// console.log(error);
			});
	}

	/**
	 * Close confirm dilog
	 */
	closeConfirmDilog() {
		this.confirmMsg = '';
	}

	add_class() {
		setTimeout(() => { this.renderer.addClass(document.body, 'modal-open'); }, 400);
	}

	/**
	 *  check Numeric value
	 */
	checkNumeric(event: any) {

		const pattern = /[0-9\+\-\ ]/;
		let inputChar = String.fromCharCode(event.charCode);

		if (!pattern.test(inputChar) && event.charCode != '0') {
			event.preventDefault();
		}
	}

	/**
	 * Close the form and reset form value
	 */
	closeRegisterForm(form: NgForm) {
		form.resetForm();
		this.msg = '';
		//set secleted value after reset from 
		let val = '';
		this.addUserForm.controls['state_id'].setValue(val);
		this.addUserForm.controls['city_id'].setValue(val);
	}


	/**
	 * get user details by id
	 * @param: userId
	 * @type:string
	 */
	getTermsDetails() {
		this.message = '';
		this.spinner.start();
		this.contentServices.gettermsDetails()
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.termdataArray = data['data'];
					let datanew = this.sanitizer.bypassSecurityTrustHtml(this.termdataArray['content']);
					this.myTermsdata = datanew['changingThisBreaksApplicationSecurity'];
					if (this.myTermsdata == '') {
						this.msgClass = 'error-message';
						this.termsmessage = 'no record found';
					}
				} else {
					this.msgClass = 'error-message';
					this.termsmessage = data['message'];
				}
			},
			error => {
				// console.log(error);				
			});
	}

	/**
	 * get user details by id
	 * @param: userId
	 * @type:string
	 */
	getAboutUsDetails(dataArray: any) {
		this.message = '';
		let data: any = dataArray;
		if (data != null) {
			this.AboutdataArray = data;
			let datanew = this.sanitizer.bypassSecurityTrustHtml(this.AboutdataArray);
			let aboutmydata = datanew['changingThisBreaksApplicationSecurity'].split('</p>');
			if (typeof aboutmydata != null) {
				this.aboutmydata = aboutmydata[0];
			} else {
				this.aboutmydata = datanew['changingThisBreaksApplicationSecurity'].substring(0, 170);
			}

			if (this.aboutmydata == '') {
				this.aboutmsgClass = 'error-message';
				this.Aboutmessage = 'no record found';
			}
		}
	}
}
