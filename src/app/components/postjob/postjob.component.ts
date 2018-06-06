import { Component, AfterViewInit, Input, Output, OnInit, trigger, state, style, ChangeDetectorRef, ChangeDetectionStrategy, transition, animate, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeServices } from '../home/home.service';
import { Home } from '../home/home';
import { StatecityServices } from '../register/services/statecity.service';
import { CompanyServices } from './services/company.service';
import { JobServices } from './services/job.service';
import { State } from '../register/models/state';
import { City } from '../register/models/city';
import { UserServices } from '../register/services/user.service';
import { User } from '../register/models/user';
import { Company } from './models/company';
import { NgForm } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FormArray } from '@angular/forms';
import { SpinnerService } from '../spinner/spinner.service';
import { DatePipe } from '@angular/common';
import { IMyDpOptions, IMyDateModel, IMyOptions, IMyMarkedDates } from 'mydatepicker';
import { Shared, SharedModel } from '../services/shared.service';
import { Meta } from '@angular/platform-browser';

declare var $;
@Component({
	selector: 'app-postjob',
	templateUrl: './postjob.component.html',
	providers: [StatecityServices, JobServices, CompanyServices, HomeServices, UserServices]
})
export class PostjobComponent implements OnInit {
	states: State[]; //for state
	cities: City[]; //for city
	homes: Home[];  //for home
	users: User;
	companies: Company[];
	postJobForm: FormGroup;
	numbers: any[];
	userId: string; //for current user id
	msg: string; //for error msg
	categoriesList: any[];
	dataArray: any[];
	options: any[];
	optionsMap: any = [];
	optionsChecked: any = [];
	numberMsg: string;
	companiesAddress: any = {};
	alertMsg: string;
	disabled: boolean;
	startTimeChk: any;
	endTimeChk: any;
	isChecked: any;
	includeValues = [{ weekDay: "Saturday" }, { weekDay: "Sunday" }]
	buyer_wage: any;
	totalWage: any;
	selectedWeekends: any = [];
	cityValue: any;
	wrongTimeMsg: any;
	defaultendTime: any;
	defaultStartTime: any;
	myFile: any = [];
	maxImageError: string;
	msgClass: string;
	j: any = 0;
	confirmMsg: any;
	@ViewChild('fileInput') fileInput;
	@ViewChild('address1') address1: ElementRef;
	@ViewChild('address2') address2: ElementRef;
	@ViewChild('pincode') pincode: ElementRef;
	@ViewChild('stateValue') stateValue: ElementRef;
	@ViewChild('companySelect') companySelect: ElementRef;
	@ViewChild('confirmJobPostModel') confirmJobPostModel: ElementRef;
	@ViewChild('resetCheck') resetCheck: ElementRef;
	//set address in input field for address checkBox
	add1: any;
	add2: any;
	pin: any;
	//chekc buyer cost and max cost
	@ViewChild('buyercost') buyercost: ElementRef;
	@ViewChild('maxcost') maxcost: ElementRef;
	@ViewChild('allowbids') allowbids: ElementRef;
	maxCostMsg: any;
	buyerCostMsg: any;
	image: FileList;
	//Time picker
	pickerTime1: string;
	pickerTime2: string;
	date: any;
	valueDate: any;
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
		showClearDateBtn: true
	};
	//end date
	endDateOptions: IMyDpOptions = {
		inline: false,
		selectorWidth: '100%',
		dateFormat: 'yyyy-mm-dd',
		markCurrentDay: true,
		showClearDateBtn: true
	};
	// Calling this function set a new placeholder text
	changePlaceholder() {
		this.placeholder = '';
	}
	/**
	 * End date picker setting 
	 */

	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private meta: Meta, private sharedservice: Shared, private cookieService: CookieService, private spinner: SpinnerService, private homeService: HomeServices, private companyServices: CompanyServices, private jobService: JobServices, private fb: FormBuilder, private StatecityServices: StatecityServices, private router: Router, private route: ActivatedRoute, private userServices: UserServices, private myElement: ElementRef, private renderer: Renderer2) {
		this.postJobForm = this.fb.group({
			'include_value': this.fb.array([]),
			'title': ['', Validators.required],
			'positions': ['', Validators.required],
			'state_id': ['', Validators.required],
			'city_id': ['', Validators.required],
			'description': ['', Validators.required],
			'startdate': ['', Validators.required],
			'enddate': ['', Validators.required],
			'starttime': ['', Validators.required],
			'endtime': ['', Validators.required],
			'address1': ['', Validators.required],
			'address2': ['', Validators.required],
			'pincode': ['', Validators.required],
			'jobcost': ['', Validators.required],
			'buyer_cost': ['', Validators.required],
			'allowbid_cost': ['', Validators.required],
			'allowbids': ['', Validators.required],
			'idproof': [''],
			'company_id': [''],
			'category_id': ['', Validators.required],
			'fileInput': [''],
			'addressCheck': [''],
			'buyer_wage': ['', Validators.required],
			'totalWage': ['', Validators.required],
		});
		this.numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
		this.buyer_wage = ['per day', 'per hour', 'entire job'];
		this.postJobForm.controls['buyer_wage'].setValue(this.buyer_wage[0]);
		let val = '';
		this.postJobForm.controls['state_id'].setValue(val);
		this.postJobForm.controls['city_id'].setValue(val);
		this.meta.addTags([{ name: 'post-job', content: 'Post job by employer.' }]);
	}
	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() {
		this.getAllCategory();
		this.getAllStates();
		this.userId = this.cookieService.get('userId');
		this.getCompanyDetailByUserId(this.userId);
		this.startTimeChk = new Date();

		/**
		 * Set previous date disable
		 * */
		//Set date 
		let dateValue: Date = new Date();
		// set previous of selected date
		dateValue.setDate(dateValue.getDate() - 1);
		// Get new copy of options in order the date picker detect change
		let copy: IMyOptions = this.getCopyOfOptions(this.endDateOptions);
		copy.disableUntil = {
			year: dateValue.getFullYear(),
			month: dateValue.getMonth() + 1,
			day: dateValue.getDate()
		};
		this.startDateOptions = copy;

		// Get new copy of options in order the date picker detect change
		let copy1: IMyOptions = this.getCopyOfOptions(this.startDateOptions);
		copy1.disableUntil = {
			year: dateValue.getFullYear(),
			month: dateValue.getMonth() + 1,
			day: dateValue.getDate()
		};
		this.endDateOptions = copy1;
	}
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};

	/**
	 * Set controll disabled by click on Negotible and non-negotiable
	 * and remove validation 
	 */
	isDisable: any;
	setDisabled(value: any) {
		if (value == true) {
			//disable the controll and remove validation		
			this.postJobForm.get('allowbid_cost').disable();
			this.postJobForm.get('allowbids').disable();
			this.maxcost.nativeElement.value = '';
			this.isDisable = true;
		} else {
			//enable the controll
			this.postJobForm.get('allowbid_cost').enable();
			this.postJobForm.get('allowbids').enable();
			this.buyercost.nativeElement.value = '';
			this.isDisable = false;
		}
	}
	/**
	 * +++++++++++++++++++++++++++++++++++++++++++++++++++
	 * @param event Date
	 * ++++++++++++++++++++++++++++++++++++++++++++++++++++
	 */
	//start date select
	public onStartDateChanged(event: IMyDateModel) {

		if (!event.jsdate) {

			// Get new copy of options in order the date picker detect change
			let copy: IMyOptions = this.getCopyOfOptions(this.endDateOptions);
			copy.disableUntil = {
				year: 0,
				month: 0,
				day: 0
			};
			this.endDateOptions = copy;

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
		this.postJobForm.controls['startdate'].setValue(event);
		this.wageCalculate(null);
	}

	//End date select
	public onEndDateChanged(event: IMyDateModel) {
		if (!event.jsdate) {

			// Get new copy of options in order the date picker detect change
			let copy: IMyOptions = this.getCopyOfOptions(this.endDateOptions);
			copy.disableUntil = {
				year: 0,
				month: 0,
				day: 0
			};
			this.endDateOptions = copy;

			// Get new copy of options in order the date picker detect change
			let copy1: IMyOptions = this.getCopyOfOptions(this.startDateOptions);
			copy1.disableSince = {
				year: 0,
				month: 0,
				day: 0
			};
			this.startDateOptions = copy1;


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
		this.postJobForm.controls['enddate'].setValue(event);
		this.wageCalculate(null);
	}

	public getCopyOfOptions(options): IMyOptions {
		return JSON.parse(JSON.stringify(options));
	}
	/**
	 * +++++++++++++++++++++++++++++++++++++++++++++++++++
	 * End  Date
	 * ++++++++++++++++++++++++++++++++++++++++++++++++++++
	 */

	/**
	 * CheckBox dayz
	 * @param weekDay 
	 * @param isChecked 
	 */
	onChange(weekDay: string, isChecked: boolean) {
		const emailFormArray = <FormArray>this.postJobForm.controls.include_value;
		if (isChecked) {
			emailFormArray.push(new FormControl(weekDay));
		} else {
			let index = emailFormArray.controls.findIndex(x => x.value == weekDay)
			emailFormArray.removeAt(index);
		}
		this.selectedWeekends = emailFormArray.value;
		this.wageCalculate(null);
	}

	/**
	 * fill Address on check box click
	 */
	fillAddress(event: any) {

		if (event.target.checked) {
			if (this.companySelect.nativeElement.value == '') {
				this.alertMsg = 'You posting job as personal';
			} else if (this.companiesAddress != null) {
				this.alertMsg = '';
				this.address1.nativeElement.value = this.companiesAddress['address1'];
				this.add1 = this.address1.nativeElement.value;
				this.address2.nativeElement.value = this.companiesAddress['address2'];
				if (this.address2.nativeElement.value != 'undefined') {
					this.add2 = this.address2.nativeElement.value;
				} else {
					this.add2 = '';
				}
				this.pincode.nativeElement.value = this.companiesAddress['pincode'];
				this.pin = this.pincode.nativeElement.value;
				this.postJobForm.controls['state_id'].setValue(this.companiesAddress['state_id']);
				this.onSelect(this.companiesAddress['state_id']);
				this.postJobForm.controls['city_id'].setValue(this.companiesAddress['city_id']);
			}
			else {
				this.add1 = '';
				this.add2 = '';
				this.pin = '';
				this.getAllStates();
			}
		} else {
			this.add1 = '';
			this.add2 = '';
			this.pin = '';
			setTimeout(() => {
				this.alertMsg = null;
			}, 100);
		}
	}

	/**
	 * 
	 * check buyer and max cost
	 */
	checkMaxCost(eventValue: any) {
		/*if user select job cost as non-negotiable then remove validation from maxcost 
		isDisable is true
		*/
		if (this.isDisable == false) {
			if (this.maxcost.nativeElement.value != '') {
				if (Number(eventValue.target.value) > Number(this.maxcost.nativeElement.value)) {
					eventValue.target.focus();
					eventValue.target.value = '';
					this.maxCostMsg = '';
					this.buyerCostMsg = 'You can not enter greater value then Max Allowed Bid Cost';
				} else {
					this.maxCostMsg = '';
					this.buyerCostMsg = '';
				}
			} else {
				this.maxcost.nativeElement.value = '';
				this.maxcost.nativeElement.focus();
				eventValue.target.value = '';
				this.buyerCostMsg = '';
				this.maxCostMsg = 'Please enter Max Allowed Bid Cost';
			}

		}
	}
	/**
	 * Get All States
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
	 * Get all city based on selected state
	 */
	onSelect(stateid) {
		this.spinner.start();
		//this.StatecityServices.getCityAPI(stateid)
		this.StatecityServices.getPopulerCityByStateAPI(stateid)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.cities = data['data'];
				} else {
					if (data['status'] == 'success') {
					} else {
						this.cityValue = '';
						this.cities = [];
					}
				}
			}
			)
	}

	/**
	 * Get companyAddress based on selected company
	 * if user select as personal then use current user address
	 */
	getCompanyAddress(company_Id: any) {
		this.companiesAddress = [];
		if (company_Id != '0') {
			this.spinner.start();
			//get company address
			this.companyServices.getCompanyAddress(company_Id)
				.subscribe(
				data => {
					this.spinner.stop();
					if (typeof data['data'] !== 'undefined') {
						this.companiesAddress = data['data'];
						if (this.isChecked) {
							this.resetCheck.nativeElement.click();
						}
					} else {
						if (data['status'] == 'success') {
						} else {
							this.companiesAddress = [];
						}
					}
				}
				)

		} else {

			this.spinner.start();
			//if user select as personal then get current user address
			this.userServices.getUserDetailById(this.userId)
				.subscribe(
				data => {
					this.spinner.stop();
					if (typeof data['data'] !== 'undefined') {
						this.dataArray = data['data'];
						this.dataArray['address1'] = this.dataArray['address'];
						this.companiesAddress = this.dataArray;
						if (this.isChecked) {
							this.resetCheck.nativeElement.click();
						}
					} else {

						this.msg = data['message'];
					}
				},
				error => {
					// console.log(error);
				});
		}
	}
	/**
	 * Get All Catagory
	 */
	getAllCategory() {
		this.homeService.getCategoryAPI()
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.categoriesList = data['data'];
				} else {
					this.msg = data['message']
				}
			}
			);
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
	 * Get Job File on change or select
	 */
	fileChange(event, imgTag) {
		//imgTag.innerHTML = '';
		let data: any;
		let removeIdx: any = [];
		this.image = event.target.files;
		var imgs = document.getElementById('imageID').getElementsByClassName('divImagesWrap');
		let imageLength = (5 - imgs.length);
		if (this.image.length > imageLength) {
			this.msgClass = 'error-message';
			this.maxImageError = "You can't upload more then 5 images";
		} else {
			this.maxImageError = '';
			var imgs = document.getElementById('imageID').getElementsByClassName('divImagesWrap');
			if (imgs.length < 5) {
				let fileValue: any;
				for (var i = 0; i < this.image.length; i++) {
					var reader = new FileReader();
					reader.onload = (e) => {
						var binaryString = e.target['result'];
						var file = e.target;
						var div = document.createElement("div");
						let idx: any = this.j;
						this.j++;
						idx = idx.toString();
						div.setAttribute("id", idx);
						div.setAttribute("class", "clearfix pos_rel divImagesWrap");
						div.innerHTML = "<img class='thumbnail' src='" + binaryString + "'" +
							"title='hllo'/> <img src='assets/images/delete.png' class='remove_pict' style='position:absolute;right: -7px;bottom:-4px;height:24px;width:24px;'>";

						imgTag.appendChild(div);
						div.children[1].addEventListener("click", (event) => {
							let index: any = div.id;
							index = parseInt(index);
							this.j--;
							this.myFile[index] = null;
							div.parentNode.removeChild(div);
						}, false);
					};
					reader.readAsDataURL(this.image[i]);
				}

				if (this.image.length == 1) {
					this.myFile.push(this.image[0]);
				} else {

					for (i = 0; i < this.image.length; i++) {
						this.myFile.push(this.image[i]);
					}
				}
			}
		}
	}

	/**
	 * Save Job details
	 */
	postJobData(jobFormData: any, formJob: NgForm) {
		var index;
		let fileArray = new FormData();

		for (index = 0; index <= this.myFile.length; index++) {
			fileArray.append("MyFile[]", this.myFile[index]);
		}

		if (jobFormData['jobcost'] == 'non-negotiable') {
			jobFormData['allowbid_cost'] = '';
			jobFormData['allowbids'] = '';
		}
		fileArray.append("title", jobFormData['title']);
		fileArray.append("positions", jobFormData['positions']);
		fileArray.append("state_id", jobFormData['state_id']);
		fileArray.append("city_id", jobFormData['city_id']);
		fileArray.append("description", jobFormData['description']);
		fileArray.append("startdate", jobFormData['startdate']['formatted']);
		fileArray.append("enddate", jobFormData['enddate']['formatted']);
		fileArray.append("starttime", jobFormData['starttime']);
		fileArray.append("endtime", jobFormData['endtime']);
		fileArray.append("address1", jobFormData['address1']);
		fileArray.append("address2", jobFormData['address2']);
		fileArray.append("pincode", jobFormData['pincode']);
		fileArray.append("jobcost", jobFormData['jobcost']);
		fileArray.append("buyer_cost", jobFormData['buyer_cost']);
		fileArray.append("wage_type", jobFormData['buyer_wage']);
		fileArray.append("total_wage", jobFormData['totalWage']);
		fileArray.append("allowbid_cost", jobFormData['allowbid_cost']);
		fileArray.append("idproof", jobFormData['idproof']);
		fileArray.append("company_id", jobFormData['company_id']);
		fileArray.append("category_id", jobFormData['category_id']);
		fileArray.append("include_value", jobFormData['include_value']);
		fileArray.append("allowbids", jobFormData['allowbids']);
		fileArray.append("addressCheck", jobFormData['addressCheck']);
		fileArray.append("user_id", this.userId);
		this.spinner.start();
		this.jobService.postJob(fileArray)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data'];
				} else {
					if (data['status'] == 'success') {
						window.scroll(0, 0);
						this.msgClass = 'success-message';
						this.confirmMsg = data['message'];
						this.confirmJobPostModel.nativeElement.click();
					} else {
						this.msg = data['message'];
					}
				}
			},
			error => {
				// console.log(error);
			});
	}

	closeConfirmDilog() {
		this.confirmMsg = '';
		this.router.navigate(['/openJob']);
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
	 * redirect to open jobs
	 */
	cancelJobPost() {
		this.router.navigate(['/openJob']);
	}

	/**
	 * redirect to company form
	 */
	addCompany() {
		this.router.navigate(['/company']);
	}

	/**
	 * Start Time 
	 */
	startTimeSelected(val: any, controlName: string) {
		const date = new Date(val);
		this.startTimeChk = date;
		const timeString = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		this.postJobForm.controls[controlName].setValue(timeString);
		this.wageCalculate(null);
	}

	/**
	 * End Time 
	 */
	endTimeSelected(val: any, controlName: string) {
		let flag = 0;
		const date = new Date(val);
		if (this.startTimeChk > date) {
			alert("End time can't be less then start time");
			const timeString = this.startTimeChk.getHours() + ':' + this.startTimeChk.getMinutes() + ':' + this.startTimeChk.getSeconds();
			this.postJobForm.controls[controlName].setValue(timeString);
			let endStr = timeString;
			let times = endStr.split(':');
			this.defaultendTime = new Date();
			this.defaultendTime.setHours(
				parseInt(times[0]),
				parseInt(times[1]),
				parseInt(times[2] + 3),
				0
			);
		} else {
			const timeString = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
			this.postJobForm.controls[controlName].setValue(timeString);

		}
		this.wageCalculate(null);
	}

	/**
	 * calculation of wages as per hour, per day or entire job
	 */
	wageCalculate(event) {
		let startDate = this.postJobForm.get('startdate').value;
		let endDate = this.postJobForm.get('enddate').value;
		let startTime = this.postJobForm.get('starttime').value;
		let endTmime = this.postJobForm.get('endtime').value;
		let satCount = 0;
		let sunCount = 0;
		let oneDay = 1 * 24 * 60 * 60 * 1000;
		if (this.buyercost.nativeElement.value != null
			&& (startDate != '' && endDate != '')) {

			startDate = new Date(startDate.formatted);
			endDate = new Date(endDate.formatted);
			let start_date = JSON.parse(JSON.stringify(startDate));

			while (Date.parse(start_date) <= Date.parse(JSON.parse(JSON.stringify(endDate)))) {
				let day = new Date(start_date).getDay();
				let isSaturday = (day == 6);
				let isSunday = (day == 0);
				if (isSaturday) {
					satCount++;
				}
				if (isSunday) {
					sunCount++;
				}
				start_date = new Date(start_date).setTime(new Date(start_date).getTime() + oneDay);
				start_date = new Date(start_date);
				start_date = start_date.toJSON()
			}

			startTime = this.convertTime12hrTo24hr(startTime);
			endTmime = this.convertTime12hrTo24hr(endTmime);

			// Time difference in hours
			let timeDiff = (startTime.getTime() - endTmime.getTime()) / 1000;
			timeDiff /= (60 * 60);
			timeDiff = Math.abs(Math.round(timeDiff))

			// Date difference 
			let diff = Math.abs(startDate.getTime() - endDate.getTime());
			let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
			diffDays = (diffDays == 0) ? 1 : diffDays + 1;
			if (this.selectedWeekends.length > 0) {

				this.selectedWeekends.forEach(elem => {
					if (elem != 'Saturday' && this.selectedWeekends.length == 1) {
						diffDays = diffDays - satCount;
					} else if (elem != 'Sunday' && this.selectedWeekends.length == 1) {
						diffDays = diffDays - sunCount;
					}
				});

			} else {
				let weekendCount = satCount + sunCount;
				diffDays = diffDays - weekendCount;
			}

			if (this.postJobForm.get('buyer_wage').value == 'per day') {
				this.totalWage = this.buyercost.nativeElement.value * diffDays;
			} else if (this.postJobForm.get('buyer_wage').value == 'per hour') {
				this.totalWage = this.buyercost.nativeElement.value * (diffDays * timeDiff);
			} else if (this.postJobForm.get('buyer_wage').value == 'entire job') {
				this.totalWage = this.buyercost.nativeElement.value
			}
		}
	}

	/**
	 * Convert time format from 12 hours to 24 hours.
	 */
	convertTime12hrTo24hr(selectedTime: any) {
		let time = selectedTime.split(':');
		let hrs = Number(time[0]);
		let mnts = Number(time[1]);
		let format = selectedTime.match(/\s(.*)$/);
		if (format == "PM" && hrs < 12) hrs = hrs + 12;
		if (format == "AM" && hrs == 12) hrs = hrs - 12;
		let hours = hrs.toString();
		let minutes = mnts.toString();
		if (hrs < 10) hours = "0" + hours;
		if (mnts < 10) minutes = "0" + minutes;
		let now = new Date();
		return new Date(now.toDateString() + ' ' + hours + ":" + minutes);
	}

}//end class
