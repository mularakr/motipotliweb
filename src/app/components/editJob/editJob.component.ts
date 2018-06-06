import { Component, AfterViewInit, Input, Output, OnInit, trigger, state, style, ChangeDetectorRef, ChangeDetectionStrategy, transition, animate, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeServices } from '../home/home.service';
import { Home } from '../home/home';
import { StatecityServices } from '../register/services/statecity.service';
import { CompanyServices } from '../postjob/services/company.service';
import { JobServices } from '../postjob/services/job.service';
import { UserServices } from '../register/services/user.service';
import { User } from '../register/models/user';
import { State } from '../register/models/state';
import { City } from '../register/models/city';
import { Company } from '../postjob/models/company';
import { NgForm } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FormArray } from '@angular/forms';
import { SpinnerService } from '../spinner/spinner.service';
import { Shared, SharedModel } from '../services/shared.service';
import { IMyDpOptions, IMyDateModel, IMyOptions, IMyMarkedDates } from 'mydatepicker';
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-editjob',
	templateUrl: './editJob.component.html',
	providers: [StatecityServices, JobServices, CompanyServices, HomeServices, UserServices],

})
export class EditJobComponent implements OnInit {
	states: State[]; //for state
	cities: City[]; //for city
	homes: Home[];  //for home
	users: User;
	companies: Company[];
	editJobForm: FormGroup; //Edit form group
	numbers: any[];
	userId: string; //for current user id
	msg: string; //for error msg
	categoriesList: any;
	dataArray: any[]; //Store comming data into array
	options: any[];
	optionsMap: any = [];
	optionsChecked: any = [];
	numberMsg: string;
	companiesAddress: any; //store company details 
	alertMsg: string;
	JobId: any; //current job id
	modelArray: any = {};
	userStateId: any;
	imageArray: any;
	msgClass: string;
	citiesArray: any;
	statesArray: any;
	selectedWeekends: any = [];
	setDeleteImageId: any;
	setDeleteImageIndex: any;
	totalWage: any;
	myFile: any = [];
	imageLength: number;
	maxImageError: string;
	j: any = 0;
	@ViewChild('closeImageBtn') closeImageBtn: ElementRef;
	defaultStartTime: Date;
	defaultendTime: Date;
	includeValues = [{ weekDay: "Saturday" }, { weekDay: "Sunday" }]
	@Input() Model: any;
	@Input() Model2: any;
	@ViewChild('fileInput') fileInput;
	@ViewChild('address1') address1: ElementRef; //address fill 
	@ViewChild('address2') address2: ElementRef; //address2 fill 
	@ViewChild('pincode') pincode: ElementRef; //pincode fill 
	@ViewChild('addressCheck') addressCheck: ElementRef; //address checkbox
	@ViewChild('companySelect') companySelect: ElementRef; //selected company

	//chekc buyer cost and max cost
	@ViewChild('buyercost') buyercost: ElementRef; //Check buyer cost
	@ViewChild('maxcost') maxcost: ElementRef; //check max cost
	maxCostMsg: any;
	buyerCostMsg: any;
	image: FileList;// array for image
	checkAddress: any;
	add1: any;
	add2: any;
	pin: any;
	buyer_wageAr: any;

	/**
	 * Date piker setting 
	 */
	startDateOptions: IMyDpOptions = {
		inline: false,
		selectorWidth: '100%',
		dateFormat: 'yyyy-mm-dd',
		showClearDateBtn: true
	};

	endDateOptions: IMyDpOptions = {
		inline: false,
		selectorWidth: '100%',
		dateFormat: 'yyyy-mm-dd',
		showClearDateBtn: true
	};

	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private meta: Meta, private sharedservice: Shared, private cookieService: CookieService, private spinner: SpinnerService, private homeService: HomeServices, private companyServices: CompanyServices, private jobService: JobServices, private fb: FormBuilder, private StatecityServices: StatecityServices, private router: Router, private route: ActivatedRoute, private userServices: UserServices, private myElement: ElementRef, private renderer: Renderer2) {
		this.editJobForm = this.fb.group({
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
			'totalWage': ['', Validators.required]
		});
		this.numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
		this.buyer_wageAr = ['per day', 'per hour', 'entire job'];
	}

	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() {
		this.userId = this.cookieService.get('userId');
		this.getAllCategory();
		this.getAllStates();
		//get job id from param
		this.route.params.subscribe(params => {
			this.JobId = params['jobId'];
			if (this.JobId == null) {
				this.router.navigate(['/openJob'])
			}
			this.getJobDetailsById(this.JobId);
			this.getCompanyDetailByUserId(this.userId);
		});
		//get job details by id        
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
	 * +++++++++++++++++++++++++++++++++++++++++++++++++++
	 * @param event Start Date
	 * ++++++++++++++++++++++++++++++++++++++++++++++++++++
	 */
	public onStartDateChanged(event: IMyDateModel) {
		if (!event.jsdate) {

			// Get new copy of options in order the date picker detect change
			let copy: IMyOptions = this.getCopyOfOptions(this.endDateOptions);
			copy.disableUntil = {
				year: 0,
				month: 0,
				day: 0
			};

			return;
		}
		let d: Date = new Date(event.jsdate.getTime());
		// set previous of selected date
		d.setDate(d.getDate() - 1);
		// Get new copy of options in order the date picker detect change
		let copy: IMyOptions = this.getCopyOfOptions(this.endDateOptions);
		copy.disableUntil = {
			year: d.getFullYear(),
			month: d.getMonth() + 1,
			day: d.getDate()
		};
		this.endDateOptions = copy;

		this.editJobForm.controls['startdate'].setValue(event);
		this.wageCalculate(null);

	}

	/**
	 * +++++++++++++++++++++++++++++++++++++++++++++++++++
	 * @param event End Date
	 * ++++++++++++++++++++++++++++++++++++++++++++++++++++
	 */
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
		let d: Date = new Date(event.jsdate.getTime());
		// set next of selected date
		d.setDate(d.getDate() + 1);
		// Get new copy of options in order the date picker detect change
		let copy: IMyOptions = this.getCopyOfOptions(this.startDateOptions);
		copy.disableSince = {
			year: d.getFullYear(),
			month: d.getMonth() + 1,
			day: d.getDate()
		};
		this.startDateOptions = copy;
		this.editJobForm.controls['enddate'].setValue(event);
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
	  * Set controll disabled by click on Negotible and non-negotiable
	  * and remove validation 
	  */
	isDisable: any;
	setDisabled(value: any) {
		if (value == true) {
			//disable the controll and remove validation		
			this.editJobForm.get('allowbid_cost').disable();
			this.editJobForm.get('allowbids').disable();
			this.maxcost.nativeElement.value = '';
			this.buyercost.nativeElement.value = this.modelArray.buyer_cost;
			this.isDisable = true;
		} else {
			//enable the controll
			this.editJobForm.get('allowbid_cost').enable();
			this.editJobForm.get('allowbids').enable();
			this.isDisable = false;
			this.maxcost.nativeElement.value = this.modelArray.allowbid_cost;
			this.buyercost.nativeElement.value = '';
		}
	}

	/**
	 * CheckBox dayz
	 * @param weekDay 
	 * @param isChecked 
	 */
	onChange(weekDay: string, isChecked: boolean) {
		const weekArray = this.selectedWeekends;
		if (isChecked) {
			weekArray.push(weekDay);
		} else {
			if (weekArray != null) {
				let index = weekArray.findIndex(x => x.value == weekDay)
				weekArray.splice(index, 1);
			}
		}
		this.selectedWeekends = weekArray;
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
				this.modelArray.state_id = this.companiesAddress['state_id'];
				this.onSelect(this.modelArray.state_id);
				this.modelArray.city_id = this.companiesAddress['city_id'];
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
		if (this.isDisable == false) {
			if (this.maxcost.nativeElement.value != '') {
				if (Number(eventValue.target.value) > Number(this.maxcost.nativeElement.value)) {
					eventValue.target.focus();
					eventValue.target.value = '';
					this.maxCostMsg = '';
					this.buyerCostMsg = 'Your bid was rejected';
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
				let objData = JSON.stringify(data['data']);
				this.statesArray = JSON.parse(objData);
			}
			);
	}

	/**
	 * Get All city 
	 */
	getAllUserCities(userStateId: any) {
		this.StatecityServices.getPopulerCityByStateAPI(userStateId)
			.subscribe(
			data => {
				this.citiesArray = data['data'];
			}
			);
	}

	/**
	 * Get all city based on selected state
	 */
	onSelect(stateid) {
		this.StatecityServices.getPopulerCityByStateAPI(stateid)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.citiesArray = data['data'];
				} else {
					if (data['status'] == 'success') {
					} else {
						this.citiesArray = [];
					}
				}
			}
			)
	}

	/**
	 * Get companyAddress based on selected company
	 */
	/**
		 * Get companyAddress based on selected company
		 * if user select as personal then use current user address
		 */
	getCompanyAddress(company_Id: any) {
		this.companiesAddress = {};
		if (company_Id != '0') {
			//get company address
			this.companyServices.getCompanyAddress(company_Id)
				.subscribe(
				data => {
					if (typeof data['data'] !== 'undefined') {
						this.companiesAddress = data['data'];
					} else {
						if (data['status'] == 'success') {
						} else {
							//Na
						}
					}
				}
				)

		} else {
			//if user select as personal then get current user address
			this.userServices.getUserDetailById(this.userId)
				.subscribe(
				data => {
					if (typeof data['data'] !== 'undefined') {
						this.dataArray = data['data'];
						this.dataArray['address1'] = this.dataArray['address'];
						this.companiesAddress = this.dataArray;
					} else {
						this.msg = data['message'];
					}
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
						//alert(data['message']);
					}
				}
			}
			)
	}
	/**
	 * upload Job File on change and check conditions
	 */
	fileChange(event, imgTag) {
		var j = 0;
		let data: any;
		this.image = event.target.files;
		this.imageLength = (5 - this.imageArray.length);
		var imgs = document.getElementById('imageWrap').getElementsByClassName('divImagesWrap');

		if (this.image.length > this.imageLength || this.imageLength <= imgs.length) {
			this.msgClass = 'error-message';
			this.maxImageError = "You can't upload more than 5 images";
		} else {
			this.maxImageError = '';
			var imgs = document.getElementById('imageWrap').getElementsByClassName('divImagesWrap');
			if (imgs.length < 4) {
				for (var i = 0; i < this.image.length; i++) {
					var reader = new FileReader();
					reader.onload = (e) => {
						var binaryString = e.target['result'];
						var div = document.createElement("div");
						let idx: any = this.j;
						this.j++;
						idx = idx.toString();

						div.setAttribute("id", idx);
						div.setAttribute("class", "clearfix pos_rel divImagesWrap mar-top-20");
						div.innerHTML = "<img class='thumbnail' src='" + binaryString + "'" +
							"title='hllo'/><img src='assets/images/delete.png' class='remove_pict' style='position:absolute;right: -7px;bottom:-4px;height:24px;width:24px;'>";

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
	editJobData(editFormData: any) {

		/**
		 * Get Date and change formate 
		 */
		let eDate = JSON.parse(JSON.stringify(editFormData['enddate']['date']));
		let sDate = JSON.parse(JSON.stringify(editFormData['startdate']['date']));
		let endDate = eDate['year'] + '-' + eDate['month'] + '-' + eDate['day'];
		let startDate = sDate['year'] + '-' + sDate['month'] + '-' + sDate['day'];

		if (editFormData['jobcost'] == 'non-negotiable') {
			editFormData['allowbid_cost'] = '';
			editFormData['allowbids'] = '';
		}
		this.spinner.start();
		//append all data with image 
		var index;
		let fileArray = new FormData();
		for (index = 0; index <= this.myFile.length; index++) {
			fileArray.append("MyFile[]", this.myFile[index]);
		}

		fileArray.append("title", editFormData['title']);
		fileArray.append("positions", editFormData['positions']);
		fileArray.append("state_id", editFormData['state_id']);
		fileArray.append("city_id", editFormData['city_id']);
		fileArray.append("description", editFormData['description']);
		fileArray.append("startdate", startDate);
		fileArray.append("enddate", endDate);
		fileArray.append("starttime", editFormData['starttime']);
		fileArray.append("endtime", editFormData['endtime']);
		fileArray.append("address1", editFormData['address1']);
		fileArray.append("address2", editFormData['address2']);
		fileArray.append("pincode", editFormData['pincode']);
		fileArray.append("jobcost", editFormData['jobcost']);
		fileArray.append("buyer_cost", editFormData['buyer_cost']);
		fileArray.append("wage_type", editFormData['buyer_wage']);
		fileArray.append("total_wage", editFormData['totalWage']);
		fileArray.append("allowbid_cost", editFormData['allowbid_cost']);
		fileArray.append("allowbids", editFormData['allowbids']);
		fileArray.append("idproof", editFormData['idproof']);
		fileArray.append("company_id", editFormData['company_id']);
		fileArray.append("category_id", editFormData['category_id']);
		fileArray.append("include_value", this.selectedWeekends);
		fileArray.append("addressCheck", editFormData['addressCheck']);
		fileArray.append("user_id", this.userId);
		fileArray.append("job_id", this.JobId);
		this.jobService.editJob(fileArray)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data'];
					this.msg = data['message'];
					this.msgClass = 'success-message';
					window.scroll(0, 0);
					setTimeout(() => {
						this.msg = '';
						this.router.navigate(['/openJob']);
					}, 1000);
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
					this.dataArray = data['data'];

					this.setStartDate(this.dataArray['sdate']);
					this.setEndDate(this.dataArray['edate']);
					this.getAllUserCities(this.dataArray['state_id']);
					this.modelArray.title = this.dataArray['title'];
					this.modelArray.positions = this.dataArray['positions'];
					this.modelArray.company_id = this.dataArray['company_id'];
					this.modelArray.category_id = this.dataArray['category_id'];
					this.modelArray.description = this.dataArray['description'];
					this.meta.addTags([{ name: this.dataArray['title'], content: this.dataArray['description'] }]);
					this.modelArray.include_value = this.dataArray['include_value'];
					this.selectedWeekends = this.dataArray['include_value'].split(',');
					this.selectedWeekends = this.selectedWeekends.filter((e) => { return e });
					let startStr = this.dataArray['starttime'];
					let times: string[] = startStr.split(':');
					this.defaultStartTime = new Date();
					this.defaultStartTime.setHours(
						parseInt(times[0]),
						parseInt(times[1]),
						parseInt(times[2]),
						0
					);
					let endStr = this.dataArray['endtime'];
					times = endStr.split(':');
					this.defaultendTime = new Date();
					this.defaultendTime.setHours(
						parseInt(times[0]),
						parseInt(times[1]),
						parseInt(times[2]),
						0
					);
					this.modelArray.address1 = this.dataArray['address1'];
					this.modelArray.address2 = this.dataArray['address2'];
					this.modelArray.pincode = this.dataArray['pincode'];
					this.modelArray.state_id = this.dataArray['state_id'];
					this.modelArray.city_id = this.dataArray['city_id'];
					this.modelArray.jobcost = this.dataArray['jobcost'];
					this.modelArray.allowbid_cost = this.dataArray['allowbid_cost'];
					this.modelArray.buyer_cost = this.dataArray['buyer_cost'];
					this.modelArray.buyer_wage = this.dataArray['wage_type'];
					this.modelArray.total_wage = this.dataArray['total_wage'];
					this.modelArray.allowbids = this.dataArray['allowbids'];
					this.modelArray.idproof = (this.dataArray['idproof'] == 1) ? true : false;
					this.modelArray.addressCheck = (this.dataArray['iscompany_address'] == 1) ? true : false;
					this.imageArray = this.dataArray['imageArray'];
					/**
					 * Set company Address
					 */
					this.add1 = this.dataArray['address1'];
					this.add2 = this.dataArray['address2'];
					this.pin = this.dataArray['pincode'];
					/*
					set fields disabled if job is non- negotible
					*/
					if (this.dataArray['jobcost'] == 'non-negotiable') {
						this.editJobForm.get('allowbid_cost').disable();
						this.editJobForm.get('allowbids').disable();
					}
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
	 * set Selected value sunday ,satday
	 */
	isSelected(val) {
		if (this.modelArray && this.modelArray.include_value) {
			const days: string = this.modelArray.include_value as string;
			const d: string[] = days.split(',');
			const found: string = d.find(item => val == item);
			if (found) {
				return true;
			}

			return false;
		}
	}

	/**
	* @param dateValue 
	* Set Start Date in start date datepicker for edit
	*/
	setStartDate(dateValue: any) {

		/**
		 * Set previous date disable
		 */
		// Set today date using the patchValue function
		let date = new Date(dateValue);
		date.setDate(date.getDate());
		// Get new copy of options in order the date picker detect change
		let copy: IMyOptions = this.getCopyOfOptions(this.endDateOptions);
		copy.disableUntil = {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate()
		};
		this.startDateOptions = copy;

		//Bind Value 
		this.editJobForm.patchValue({
			startdate: {
				date: {
					year: date.getFullYear(),
					month: date.getMonth() + 1,
					day: date.getDate()
				}
			}
		});

	}
	/**
	 * Time Binding
	 */
	startTimeSelected(val: any, controlName: string) {
		const date = new Date(val);
		const timeString = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		this.editJobForm.controls[controlName].setValue(timeString);
		this.wageCalculate(null);

	}
	/**
	*  
	* @param dateValue 
	* Set End Date in end date datepicker for edit
	*/
	setEndDate(dateValue: any) {
		/**
		 * Set previous date disable
		 * */
		let date = new Date(dateValue);
		// set previous of selected date
		date.setDate(date.getDate());
		// Get new copy of options in order the date picker detect change
		let copy: IMyOptions = this.getCopyOfOptions(this.endDateOptions);
		copy.disableUntil = {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate()
		};
		this.endDateOptions = copy;

		// Set today date using the patchValue function 
		//Bind Value    
		this.editJobForm.patchValue({
			enddate: {
				date: {
					year: date.getFullYear(),
					month: date.getMonth() + 1,
					day: date.getDate()
				}
			}
		});
		this.wageCalculate(null);
	}


	/**
	 * Get start Date
	 * 
	 */
	getstartDate(event) {
		if (event.dateType == 'date1') {
			this.Model = event.startdate;
		} else {
			this.Model2 = event.startdate;
		}
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
	  * redirect to openJOb page
	  */
	cancelJobPost() {
		window.scroll(0, 0);
		this.router.navigate(['/openJob']);
	}

	/**
	 * Delete Job Image on click
	 */
	deleteImage(isAgree: any) {
		if (isAgree == 'true') {
			let imageId = this.setDeleteImageId; //Value comming from  setDeleteImageVal()
			let index = this.setDeleteImageIndex; //Value comming from  setDeleteImageVal()
			this.closeImageBtn.nativeElement.click();

			this.spinner.start();
			if (index !== -1) {
				this.imageArray.splice(index, 1);
			}

			this.jobService.deleteJobImage(imageId)
				.subscribe(
				data => {
					this.spinner.stop();
					if (typeof data['data'] !== 'undefined') {
					} else {
						if (data['status'] == 'success') {
							this.setDeleteImageId = null;
							this.setDeleteImageIndex = null;
						} else {
							// alert(data['message']);
						}
					}
				}
				)
		} else {
			this.setDeleteImageId = null;
			this.setDeleteImageIndex = null;
		}
	}


	/**
	   * Set details which going to be delete
	   */
	setDeleteImageVal(id: any, index: any) {
		//Set details which going to be delete
		this.setDeleteImageId = id;
		this.setDeleteImageIndex = index;
	}

	/**
	 * calculation of wages as per hour, per day or entire job
	 */
	wageCalculate(event) {
		let startDate = this.editJobForm.get('startdate').value;
		let endDate = this.editJobForm.get('enddate').value;
		let startTime = this.editJobForm.get('starttime').value;
		let endTmime = this.editJobForm.get('endtime').value;
		let satCount = 0;
		let sunCount = 0;
		let oneDay = 1 * 24 * 60 * 60 * 1000;
		if (this.buyercost.nativeElement.value != null
			&& (startDate != '' && endDate != '')) {


			startDate = new Date(startDate.date.year, startDate.date.month - 1, startDate.date.day, 0, 0);
			endDate = new Date(endDate.date.year, endDate.date.month - 1, endDate.date.day, 0, 0);

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

			if (this.editJobForm.get('buyer_wage').value == 'per day') {
				this.totalWage = this.buyercost.nativeElement.value * diffDays;
				this.modelArray.total_wage = this.totalWage;
			} else if (this.editJobForm.get('buyer_wage').value == 'per hour') {
				this.totalWage = this.buyercost.nativeElement.value * (diffDays * timeDiff);
				this.modelArray.total_wage = this.totalWage;
			} else if (this.editJobForm.get('buyer_wage').value == 'entire job') {
				this.totalWage = this.buyercost.nativeElement.value;
				this.modelArray.total_wage = this.totalWage;
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
