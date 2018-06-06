import { Component, AfterViewInit, Input, Output, OnInit, trigger, state, style, ChangeDetectorRef, ChangeDetectionStrategy, transition, animate, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StatecityServices } from '../register/services/statecity.service';
import { State } from '../register/models/state';
import { City } from '../register/models/city';
import { Company } from '../postjob/models/company';
import { CompanyServices } from '../postjob/services/company.service';
import { NgForm } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { SpinnerService } from '../spinner/spinner.service';
import { CookieService } from 'ngx-cookie-service';
import { UpperCasePipe } from '@angular/common/src/pipes/case_conversion_pipes';
import { Shared, SharedModel } from '../services/shared.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-company',
	templateUrl: './company.component.html',
	providers: [StatecityServices, CompanyServices],
})
export class CompanyComponent implements OnInit {

	@ViewChild('logoFile') logoFileVariable: ElementRef;
	@ViewChild('file') allFileVariable: ElementRef;
	@ViewChild('documentFile') documentFile: ElementRef;
	@ViewChild('listDoc') listDoc: ElementRef;
	@ViewChild('closeBtn') closeBtn: ElementRef;
	@ViewChild('closeImageBtn') closeImageBtn: ElementRef;
	states: State[];
	cities: City[];
	companyForm: FormGroup;
	companymodel: Company;
	errorMessage: String;
	response: any;
	loading = false;
	message: string;
	msg: any;
	dataArray: any;
	modelArray: any = {};
	userId: any;
	companies: Company[];
	userStateId: any;
	isDataAvailable: boolean = false;
	checkTitle: boolean = false;
	company_logo: any;
	logoImage: any;
	delMsg: any;

	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private sharedservice: Shared, private cookieService: CookieService, private spinner: SpinnerService, private CompanyServices: CompanyServices, private fb: FormBuilder, private StatecityServices: StatecityServices, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private renderer: Renderer2, private meta: Meta) {
		this.companyForm = this.fb.group({
			'title': ['', Validators.required],
			'bio': [''],
			'state_id': ['', Validators.required],
			'city_id': ['', Validators.required],
			'address1': ['', Validators.required],
			'address2': ['', Validators.required],
			'fileInput': [''],
			'myfile': [''],
			'phone': ['', Validators.required],
			'pincode': ['', Validators.required],
			'companyId': [''],

		});

		//set default selected state and city 
		this.modelArray.state_id = '';
		this.modelArray.city_id = '';

		this.meta.addTags([{ name: 'Company', content: 'Component to add company details.' }]);
	}

	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() {
		this.getAllStates();
		this.userId = this.cookieService.get('userId');

		if (!this.userId) {
			this.router.navigate([''])
		}
		this.companyList(this.userId);
		this.company_logo = null;
	}
	/**
	 * Respond after Angular initializes the component's views and child views
	 */
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};

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
		this.StatecityServices.getCityAPI(stateid)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.cities = data['data'];
				} else {
					if (data['status'] == 'success') {
					} else {
						// console.log(data['message']);
						// alert(data['message']);
					}
				}
			}
			)
	}
	/**
	 * Get All cities which related to current users
	 */
	getAllUserCities(userStateId: any) {
		this.StatecityServices.getAllUserCity(userStateId)
			.subscribe(
			data => {
				this.cities = data['data'];
				//console.log(this.cities);
			}
			);
	}
	/**
	 * Upload Multiple Company Documents image,pdf,doc
	 * 
	 */
	myFile: any = [];
	maxImageError: string;
	temp: any = [];
	documentsArray: FileList;
	addCompanyDocuments(event, imgTag) {
		let j = 0;
		let data: any;
		this.maxImageError = '';
		let filenumber: number;
		let imageExt = ['IMAGE/JPEG', 'IMAGE/JPG', 'IMAGE/PNG', 'IMAGE/GIF', 'IMAGE/BMP', 'IMAGE/TIFF'];
		let pdfExt = ['APPLICATION/PDF'];
		let docExt = ['APPLICATION/DOC', 'APPLICATION/DOCX', 'APPLICATION/MSWORD'];
		let no = ['IMAGE/JPEG', 'IMAGE/JPG', 'IMAGE/PNG', 'IMAGE/GIF', 'IMAGE/BMP', 'IMAGE/TIFF', 'APPLICATION/PDF', 'APPLICATION/DOC', 'APPLICATION/DOCX', 'APPLICATION/MSWORD'];
		let k = 0;

		this.documentsArray = event.target.files;
		for (let i = 0; i < this.documentsArray.length; i++) {
			let j = i;
			let reader = new FileReader();
			reader.onload = (e) => {
				//get comming file extension         
				let ext = e.target['result'].split(';');
				let fileExt = ext[0].split(':');
				let finalExt = fileExt[1].replace(/^.*\./, '').toUpperCase();
				if (imageExt.indexOf(finalExt) !== -1) {
					let binaryString = e.target['result'];
					let img = document.createElement("img");
					img.src = binaryString;
					img.alt = i.toString();
					imgTag.appendChild(img);
				} else if (pdfExt.indexOf(finalExt) !== -1) {

					let binaryString = e.target['result'];
					let embed = document.createElement("img");//iframe   embed           
					embed.id = 'pdf';
					embed.src = 'assets/images/pdf.png';
					imgTag.appendChild(embed);
				} else if (docExt.indexOf(finalExt) !== -1) {
					let binaryString = e.target['result'];
					let embed = document.createElement("img");//iframe   embed           
					embed.id = 'pdf';
					embed.src = 'assets/images/doc.png';
					imgTag.appendChild(embed);
				}
			};
			reader.readAsDataURL(this.documentsArray[i]);
		}
		for (let l = 0; l < this.documentsArray.length; l++) {
			if (no.indexOf(this.documentsArray[l].type.toUpperCase()) !== -1) {
				this.myFile.push(this.documentsArray[l]);
			}
		}

		//
	}

	/**
	* Get Job File on change
	*/
	myLogo: any = [];
	imageMsg: string;
	logoChange(event, imgTag) {

		this.logoImage = event.target.files;
		let imageExt = ['JPEG', 'JPG', 'PNG', 'GIF', 'BMP', 'TIFF'];
		let fileExtension = this.logoImage[0]['name'].replace(/^.*\./, '').toUpperCase();
		if (imageExt.indexOf(fileExtension) !== -1) {
			this.allFileVariable.nativeElement.innerHTML = '';
			let j = 0;
			let data: any;
			this.logoImage = event.target.files;
			let reader = new FileReader();
			reader.onload = function (e) {
				let binaryString = e.target['result'];
				let img = document.createElement("img");
				img.src = binaryString;
				imgTag.appendChild(img);
			};
			reader.readAsDataURL(this.logoImage[0]);
			this.myLogo = this.logoImage[0];
		} else {
			imgTag.innerHTML = '';
			this.imageMsg = 'select image only';
			this.msgClass = 'error-message';
			setTimeout(() => {
				this.imageMsg = null;
			}, 2000);
		}
	}

	/**
	 * addCompanyData
	 * add company details 
	 */
	msgClass: string;
	addCompanyData(formData: any, form: NgForm) {
		let index;
		let fileArray = new FormData();
		for (index = 0; index < this.myFile.length; index++) {
			fileArray.append("MyFile[]", this.myFile[index]);
		}
		fileArray.append("avatar", this.myLogo);
		fileArray.append("title", formData['title']);
		fileArray.append("bio", formData['bio']);
		fileArray.append("phone", formData['phone']);
		fileArray.append("pincode", formData['pincode']);
		fileArray.append("state_id", formData['state_id']);
		fileArray.append("city_id", formData['city_id']);
		fileArray.append("address1", formData['address1']);
		fileArray.append("address2", formData['address2']);
		fileArray.append("companyId", formData['companyId']);
		fileArray.append("user_id", this.userId);
		this.spinner.start();
		this.CompanyServices.addCompany(fileArray)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data'];
					this.msgClass = 'success-message';
					this.msg = data['message'];
					window.scroll(0, 0);
					form.resetForm();
					//set ddefault selected value for state and city after reset form
					this.modelArray.state_id = '';
					this.modelArray.city_id = '';
					this.noRecord = '';//null no record found var
					///to show  listing of all companies///     
					this.companyList(this.userId);
					this.checkTitle = false;
					this.logoFileVariable.nativeElement.innerHTML = '';
					this.documentFile.nativeElement.innerHTML = '';
					if (this.company_logo != null) {
						this.allFileVariable.nativeElement.innerHTML = '';
					}
					if (this.imageArray != null) {
						this.listDoc.nativeElement.innerHTML = '';
					}
					setTimeout(() => {
						this.msg = null;
					}, 2000);
				} else {
					if (data['status'] == 'success') {
						//console.log('success');
					} else {
						//console.log(data['message']);           
					}
				}
			});
	}

	/**
	 * Get all company List
	 */
	noRecord: any;
	companyList(userid: any) {
		this.spinner.start();
		this.CompanyServices.getUserCompany1(userid)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.companies = data['data'];
					this.noRecord = '';
				} else {
					this.msgClass = 'error-message';
					this.noRecord = data['message'];
				}
			}
			);
	}

	/**
	 * deleteCompany details by id
	 */
	//deleteCompany(companyid: any, index: any) {
	deleteCompany(isAgree: any) {
		if (isAgree == 'true') {
			let companyid = this.setDeleteCompanyId; //Value comming from  setDeleteCompanyVal()
			let index = this.setDeleteCompanyIndex; //Value comming from  setDeleteCompanyVal()
			this.closeBtn.nativeElement.click();
			this.CompanyServices.deleteCompany(companyid)
				.subscribe(
				data => {
					if (typeof data['data'] !== 'undefined') {

					} else {
						if (data['status'] == 'success') {
							if (index !== -1) {
								this.companies.splice(index, 1);
							}
							//null set value
							this.setDeleteCompanyId = null;
							this.setDeleteCompanyIndex = null;
							this.msgClass = 'success-message';
							this.delMsg = data['message'];
							setTimeout(() => {
								this.delMsg = null;
							}, 2000);
						} else {
							this.msgClass = 'success-message';
							this.delMsg = data['message'];
							setTimeout(() => {
								this.delMsg = null;
							}, 2000);
						}
					}
				}
				);
		} else {
			this.setDeleteCompanyId = null;
			this.setDeleteCompanyIndex = null;
		}
	}

	/**
	 * Set details which going to be accept or delete
	 */
	setDeleteCompanyId: any;
	setDeleteCompanyIndex: any;
	setDeleteCompanyVal(id: any, index: any) {
		//Set details which going to be accept or delete
		this.setDeleteCompanyId = id;
		this.setDeleteCompanyIndex = index;
	}

	/**
	 * getCompanyData
	 */
	getCompanyData(companyid: any) {
		this.logoFileVariable.nativeElement.innerHTML = '';
		this.documentFile.nativeElement.innerHTML = '';
		this.spinner.start();
		this.CompanyServices.getCompanyDetailById(companyid)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data'];
					this.getCompanyDocuments(this.dataArray['id']);
					this.getAllUserCities(this.dataArray['state_id']);
					this.modelArray.title = this.dataArray['title'];
					this.modelArray.phone = this.dataArray['phone'];
					this.modelArray.bio = this.dataArray['bio'];
					this.modelArray.address1 = this.dataArray['address1'];
					this.modelArray.address2 = this.dataArray['address2'];
					this.modelArray.state_id = this.dataArray['state_id'];
					this.modelArray.city_id = this.dataArray['city_id'];
					this.modelArray.pincode = this.dataArray['pincode'];
					this.modelArray.companyId = this.dataArray['id'];
					if (this.dataArray['company_logo'] != '') {
						this.company_logo = this.dataArray['company_logo'];
					} else {
						this.company_logo = null;
					}
					this.cookieService.set('UserStatId', this.dataArray['state_id']);
					this.checkTitle = true;
				} else {
					this.msg = data['message']
				}
			});
	}

	/**
	 * Company Documens
	 */
	imageArray: any = [];
	getCompanyDocuments(companyID: any) {
		this.CompanyServices.getCompanyDocById(companyID)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data'];
					this.imageArray = this.dataArray['imageArray'];
				} else {
					this.imageArray = [];
				}
			});
	}

	/***
	 *  checkNumeric privent char value 
	 */
	checkNumeric(event: any) {

		const pattern = /[0-9\+\-\ ]/;
		let inputChar = String.fromCharCode(event.charCode);

		if (!pattern.test(inputChar) && event.charCode != '0') {
			event.preventDefault();
		}
	}

	/**
	 * Delete Job Image on click
	 */
	deleteImage(isAgree: any) {
		if (isAgree == 'true') {

			let imageid = this.setDeleteImageId; //Value comming from  setDeleteImageVal()
			let index = this.setDeleteImageIndex; //Value comming from  setDeleteImageVal()
			this.closeImageBtn.nativeElement.click();
			this.spinner.start();
			this.CompanyServices.deleteCompanyDoc(imageid)
				.subscribe(
				data => {
					this.spinner.stop();
					if (typeof data['data'] !== 'undefined') {
					} else {
						if (data['status'] == 'success') {

							if (index !== -1) {
								this.imageArray.splice(index, 1);
							}
							this.setDeleteImageId = null;
							this.setDeleteImageIndex = null;
						} else {
							// alert(data['message']);
						}
					}
				}
				);
		} else {
			this.setDeleteImageId = null;
			this.setDeleteImageIndex = null;
		}
	}

	/**
	 * Set details which going to be delete
	 */
	setDeleteImageId: any;
	setDeleteImageIndex: any;
	setDeleteImageVal(id: any, index: any) {
		//Set details which going to be delete
		this.setDeleteImageId = id;
		this.setDeleteImageIndex = index;
	}
	/**
	 * redirect to open jobs
	 */
	cancelCompany() {
		this.router.navigate(['/postjob']);
	}

}
