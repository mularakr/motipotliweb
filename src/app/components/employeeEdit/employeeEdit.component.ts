import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeServices } from '../home/home.service';
import { Home } from '../home/home';
import { StatecityServices } from '../register/services/statecity.service';
import { UserServices } from '../register/services/user.service';
import { State } from '../register/models/state';
import { City } from '../register/models/city';
import { User } from '../register/models/user';
import { SpinnerService } from '../spinner/spinner.service';
import { CookieService } from 'ngx-cookie-service';
import { Shared, SharedModel } from '../services/shared.service';
import { otpVerificationService } from '../otpVerification/otpVerification.service';
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-edit',
	templateUrl: './employeeEdit.component.html',
	providers: [StatecityServices, HomeServices, UserServices],
})
export class EmployeeEditComponent implements OnInit {
	@ViewChild('fileInput') fileInput;
	@ViewChild('document') documentFileVariable: any;
	@ViewChild('closeDocBtn') closeDocBtn: ElementRef;
	@ViewChild('companyDoc') companyDoc: ElementRef;
	@ViewChild('document') document: ElementRef;

	states: State[];
	cities: City[];
	homes: Home[];
	users: User;
	@Input() user;
	editEmployeeForm: FormGroup;
	loading = false;
	msg: any;
	dataArray: any;
	userId: string;
	userStateId: string;
	model: any = {};
	imageArray: any[];
	imgMsg: any;
	loginType: any;
	profileimg: string;
	catagryArray: any;
	cityArray: any;
	email: any;
	image: FileList;
	doc_file: any;
	docMsg: any;
	checkImageExtArray: any = [];
	docType: any;
	docImageArray: any = [];
	setDeleteDocId: any;
	setDeleteDocIndex: any;
	myFile: any = [];
	maxImageError: string;
	temp: any = [];
	documentsArray: FileList;
	j: any = 0;
	msgClass: string;

	/**
	  * constructor
	  * this is called by the JavaScript engine
	  * rather than Angular
	  * dependencies we require 
	  */
	constructor(private meta: Meta, private sharedservice: Shared, private cookieService: CookieService, private spinner: SpinnerService, private StatecityServices: StatecityServices, private homeService: HomeServices, private userServices: UserServices, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private otpService: otpVerificationService) {
		this.editEmployeeForm = this.fb.group({
			'name': ['', Validators.required],
			'phone': ['', Validators.required],
			'state_id': [''],
			'city_id': [''],
			'city2_id': [''],
			'email': [''],
			'bio': [''],
			'pincode': [''],
			'address': [''],
			'address2': [''],
			'fileInput': [''],
			'company': [''],
			'category_id': ['', Validators.required],

		});
		this.meta.addTags([{ name: 'edit-employee-profile', content: 'edit profile functionalities for employee.' }]);
	}

	//Drop Down for category
	dropdownList = [];
	selectedItems: any = [];
	dropdownSettings = {};

	//Drop Down for city
	dropdownListCity = [];
	selectedItemsCity: any = [];
	dropdownSettingsCity = {};

	/**
	   * ngOnInit called on demand by Angular
	   * initialising the component.
	   */
	ngOnInit() {
		this.getAllStates();//Get All States
		this.getAllCategory();//Get All Category
		this.userId = this.cookieService.get('userId');
		this.loginType = this.cookieService.get('login_type');
		if (!this.userId) {
			this.router.navigate([''])
		}
		if (this.userId) {
			this.getUserDetailById(this.userId);
			this.getUserDocById(this.userId);
			this.getAllPopularCities();
		}
		if (this.userStateId) {
			this.userStateId = this.cookieService.get('UserStatId');
			this.getAllUserCities(this.userStateId);
		}

		//Drop Down for Category
		this.dropdownSettings = {
			singleSelection: false,
			text: "--Select--",
			selectAllText: 'Select All',
			unSelectAllText: 'UnSelect All',
			enableSearchFilter: true,
			classes: "myclass custom-class"
		};

		//Drop Down for city
		this.dropdownSettingsCity = {
			singleSelection: false,
			text: "--Select--",
			selectAllText: 'Select All',
			unSelectAllText: 'UnSelect All',
			enableSearchFilter: true,
			classes: "myclass custom-class"
		};
	}

	/**
	 * category Dropdown
	*/
	onItemSelect(item: any) {
		//console.log(item);
		// console.log(this.selectedItems);
	}
	OnItemDeSelect(item: any) {
		//console.log(item);
		// console.log(this.selectedItems);
	}
	onSelectAll(items: any) {
		//console.log(items);
	}
	onDeSelectAll(items: any) {
		//console.log(items);
	}

	/**
	 *City multi select 
	*/
	onItemSelectCity(item: any) {
		//console.log(item);
		// console.log(this.selectedItemsCity);
	}
	OnItemDeSelectCity(item: any) {
		//console.log(item);
		// console.log(this.selectedItemsCity);
	}
	onSelectAllCity(items: any) {
		//console.log(items);
	}
	onDeSelectAllCity(items: any) {
		//console.log(items);
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
	 * Get All cities based on current user state 
	 */
	getAllUserCities(userStateId: any) {
		this.spinner.start();
		this.StatecityServices.getAllUserCity(userStateId)
			.subscribe(
			data => {
				this.spinner.stop();
				this.cities = data['data'];
			}
			);
	}
	/**
	 * get All Category 
	 */
	getAllCategory() {

		this.homeService.getCategoryAPI()
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					data['data'].forEach((elem, i) => {
						this.dropdownList.push({ "id": elem.id, "itemName": elem.name });
					});
				} else {
					//this.msg = data['message']
				}
			}
			);

	}

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

					data['data'].forEach((elem, i) => {
						this.dropdownListCity.push({ "id": elem.id, "itemName": elem.name });
					});
				} else {
					if (data['status'] == 'success') {
						// console.log('success');
					} else {
						//alert(data['message']);
					}
				}
			}
			)
	}
	/**
	 * Get City details based on selected state
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
						//alert(data['message']);
					}
				}
			}
			)
	}

	/**
	 * get User Doc by id
	 * @param: userId
	 * @type:string
	 */
	getUserDocById(userId: any) {
		this.userServices.getUserDocDetailById(userId)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data'];
					this.docImageArray = this.dataArray['imageArray'];
				} else {
					this.docMsg = data['message'];
					this.docImageArray = [];
					this.doc_file = '';
				}
			});
	}

	/**
   * Delete Job Image on click
   */
	deleteUserDoc(isAgree: any) {
		if (isAgree == 'true') {
			let docID = this.setDeleteDocId; //Value comming from  setDeleteUserDoc()
			let index = this.setDeleteDocIndex; //Value comming from  setDeleteUserDocs()
			this.closeDocBtn.nativeElement.click();
			this.spinner.start();
			this.userServices.deleteUserDoc(docID)
				.subscribe(
				data => {
					this.spinner.stop();
					if (typeof data['data'] !== 'undefined') {
					} else {
						if (data['status'] == 'success') {
							if (index !== -1) {
								this.docImageArray.splice(index, 1);
							}
							this.setDeleteDocId = null;
							this.setDeleteDocIndex = null;
						} else {
							// alert(data['message']);
						}
					}
				}
				);
		} else {
			this.setDeleteDocId = null;
			this.setDeleteDocIndex = null;
		}
	}

	/**
	 * Set details which going to be delete
	 */
	setDeleteUserDoc(id: any, index: any) {
		//Set details which going to be delete
		this.setDeleteDocId = id;
		this.setDeleteDocIndex = index;
	}

	/**
	 * Get User Details By user id
	 */
	categoryMsg: any;
	getUserDetailById(userId: any) {
		this.spinner.start();
		this.userServices.getUserDetailById(userId)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data'];
					this.getAllUserCities(this.dataArray['state_id']);
					this.model.name = this.dataArray['name'];
					this.email = this.dataArray['email'];
					this.model.phone = this.dataArray['phone'];
					this.model.address = this.dataArray['address'];
					this.model.address2 = this.dataArray['address2'];
					this.model.state_id = this.dataArray['state_id'];
					this.model.pincode = this.dataArray['pincode'];
					this.model.bio = this.dataArray['bio'];
					this.model.city_id = this.dataArray['city_id'];
					this.model.city2_id = this.dataArray['city2_id'];
					this.model.company = this.dataArray['company'];
					if (this.dataArray['category_id'] != '') {
						this.selectedItems = this.dataArray['category_id'];

					} else {
						this.selectedItems = [
						];
					}
					if (this.selectedItems == '') {
						this.categoryMsg = 'you need to update your job category';
					} else {
						this.categoryMsg = '';
					}
					if (this.dataArray['city_id'] != '') {
						this.selectedItemsCity = this.dataArray['city_id'];
					} else {
						this.selectedItemsCity = [];
					}
					if (this.dataArray['profileimg'] != '') {
						this.profileimg = this.dataArray['profileimg'];
					} else {
						this.profileimg = '/assets/images/image_nostroke.png';
					}
					this.cookieService.set('UserStatId', this.dataArray['state_id']);
				} else {
					this.msg = data['message']
				}

			},
			error => {
				// console.log(error);
			});
	}

	/**
	 * get image and upload on image click
	 */
	imageChanged(event, imgTag) {

		this.image = event.target.files;
		var reader = new FileReader();
		reader.onload = function (e) {
			var binaryString = e.target['result'];
			imgTag.src = e.target['result'];
		};
		reader.readAsDataURL(this.image[0]);
		this.uploadProfileMedia(this.image[0]);
	}
	/**
	 * Upload user profile image
	 */
	uploadProfileMedia(image: any) {
		this.spinner.start();
		if (image != null) {
			let formData = new FormData();
			formData.append("avatar", image);
			this.userServices.editUserFile(formData, this.userId)
				.subscribe(
				data => {
					this.spinner.stop();
					if (typeof data['data'] !== 'undefined') {
						this.dataArray = data['data'];
					} else {
						if (data['status'] == 'success') {
							this.imgMsg = data['message'];
							setTimeout(() => {
								this.imgMsg = null;
							}, 3000);
						} else {
							this.imgMsg = data['message'];
							setTimeout(() => {
								this.imgMsg = null;
							}, 3000);
						}
					}
				},
				error => {
					// console.log(error);
				});
		}
	}

	/**
	 * Upload Multiple Documents image,pdf,doc only
	 * 
	 */
	addUserDocuments(event, imgTag) {
		var j = 0;
		let data: any;
		this.maxImageError = '';
		let filenumber: number;
		//Check image ext
		var imageExt = ['IMAGE/JPEG', 'IMAGE/JPG', 'IMAGE/PNG', 'IMAGE/GIF', 'IMAGE/BMP', 'IMAGE/TIFF'];
		var pdfExt = ['APPLICATION/PDF'];   //Check pdf ext
		var docExt = ['APPLICATION/DOC', 'APPLICATION/DOCX', 'APPLICATION/MSWORD'];
		var no = ['IMAGE/JPEG', 'IMAGE/JPG', 'IMAGE/PNG', 'IMAGE/GIF', 'IMAGE/BMP', 'IMAGE/TIFF', 'APPLICATION/PDF', 'APPLICATION/DOC', 'APPLICATION/DOCX', 'APPLICATION/MSWORD'];
		let k = 0;

		this.documentsArray = event.target.files;
		for (var i = 0; i < this.documentsArray.length; i++) {
			let j = i;
			var reader = new FileReader();
			reader.onload = (e) => {
				//get comming file extension         
				let ext = e.target['result'].split(';');
				let fileExt = ext[0].split(':');
				let finalExt = fileExt[1].replace(/^.*\./, '').toUpperCase();
				if (imageExt.indexOf(finalExt) !== -1) {

					var binaryString = e.target['result'];
					var img = document.createElement("div");
					let idx: any = this.j;
					this.j++;
					idx = idx.toString();
					img.setAttribute("id", idx);
					img.setAttribute("class", "clearfix pos_rel divImagesWrap");
					img.innerHTML = "<img class='thumbnail' src='" + binaryString + "'" +
						"title='hllo'/> <img src='assets/images/delete.png' class='remove_pict' style='position:absolute;right: -7px;bottom:-4px;height:24px;width:24px;'>";
					imgTag.appendChild(img);
					img.children[1].addEventListener("click", (event) => {
						let index: any = img.id;
						index = parseInt(index);
						this.j--;
						this.myFile[index] = null;
						img.parentNode.removeChild(img);
					}, false);
				} else if (pdfExt.indexOf(finalExt) !== -1) {

					var binaryString = e.target['result'];
					var img = document.createElement("div");
					let idx: any = this.j;
					this.j++;
					idx = idx.toString();
					img.setAttribute("id", idx);
					img.setAttribute("class", "clearfix pos_rel divImagesWrap");
					img.innerHTML = "<img id='pdf' class='thumbnail' src='assets/images/pdf.png'" +
						"title='hllo'/> <img src='assets/images/delete.png' class='remove_pict' style='position:absolute;right: -7px;bottom:-4px;height:24px;width:24px;'>";
					imgTag.appendChild(img);
					img.children[1].addEventListener("click", (event) => {
						let index: any = img.id;
						index = parseInt(index);
						this.j--;
						this.myFile[index] = null;
						img.parentNode.removeChild(img);
					}, false);
				} else if (docExt.indexOf(finalExt) !== -1) {
					var binaryString = e.target['result'];
					var img = document.createElement("div");
					let idx: any = this.j;
					this.j++;
					idx = idx.toString();
					img.setAttribute("id", idx);
					img.setAttribute("class", "clearfix pos_rel divImagesWrap");
					img.innerHTML = "<img id='pdf' class='thumbnail' src='assets/images/doc.png'" +
						"title='hllo'/> <img src='assets/images/delete.png' class='remove_pict' style='position:absolute;right: -7px;bottom:-4px;height:24px;width:24px;'>";
					imgTag.appendChild(img);
					img.children[1].addEventListener("click", (event) => {
						let index: any = img.id;
						index = parseInt(index);
						this.j--;
						this.myFile[index] = null;
						img.parentNode.removeChild(img);
					}, false);
				}
			};
			reader.readAsDataURL(this.documentsArray[i]);
		}
		for (let l = 0; l < this.documentsArray.length; l++) {
			if (no.indexOf(this.documentsArray[l].type.toUpperCase()) !== -1) {
				this.myFile.push(this.documentsArray[l]);
			}
		}
	}

	/**
	 * Edit Employee Details
	 */
	editEmployeDetails(formData: any) {
		let index;
		let index1;
		let indexCity;
		let fileArray = new FormData();
		let Array1 = fileArray;

		//City 
		for (indexCity = 0; indexCity < formData['city_id'].length; indexCity++) {
			fileArray.append("MyCityValue[" + indexCity + "]", JSON.stringify(formData['city_id'][indexCity]));
		}

		//category Array
		for (index1 = 0; index1 < formData['category_id'].length; index1++) {
			fileArray.append("MyValue[" + index1 + "]", JSON.stringify(formData['category_id'][index1]));
		}

		for (index = 0; index < this.myFile.length; index++) {
			fileArray.append("MyFile[]", this.myFile[index]);
		}
		fileArray.append("address", formData['address']);
		fileArray.append("address2", formData['address2']);
		fileArray.append("bio", formData['bio']);
		fileArray.append("category_id", formData['category_id']);
		fileArray.append("state_id", formData['state_id']);
		fileArray.append("city_id", formData['city_id']);
		fileArray.append("city2_id", formData['city2_id']);
		fileArray.append("company", formData['company']);
		fileArray.append("name", formData['name']);
		fileArray.append("phone", formData['phone']);
		fileArray.append("pincode", formData['pincode']);
		fileArray.append("location", formData['location']);
		fileArray.append("user_id", this.userId);
		this.spinner.start();
		this.userServices.editUserDetails(fileArray)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {

					let cookieLifeSpan = new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate());
					this.cookieService.set('name', formData['name'], cookieLifeSpan);
					this.sharedservice.changedUserNAme.next(formData['name']);

					this.dataArray = data['data'];
					this.getUserDetailById(this.userId);
					this.msg = data['message'];
					this.msgClass = 'success-message';
					window.scroll(0, 0);
					setTimeout(() => {
						this.msg = null;
					}, 3000);
					if (this.dataArray['User']['otp_status'] != '0') {
						this.cookieService.set('otp_status', this.dataArray['User']['otp_status']);
						this.otpService.openPop();
					}
				} else {
					if (data['status'] == 'success') {
						this.msg = data['message'];
						setTimeout(() => {
							this.msg = null;
						}, 3000);
					} else {
						this.msg = data['message'];
						setTimeout(() => {
							this.msg = null;
						}, 3000);
					}
				}

				this.companyDoc.nativeElement.innerHTML = '';
				this.document.nativeElement.innerHTML = '';
				this.myFile = [];
				this.getUserDocById(this.userId);
			},
			error => {
				// console.log(error);
			});
	}

	/**
	 * redirct to home after cancel forgot button clicked 
	 */
	cancelForgot() {

		this.router.navigate(['']);
	}

	/**
	 * privent user to enter char value
	 */
	checkNumeric(event: any) {

		const pattern = /[0-9\+\-\ ]/;
		let inputChar = String.fromCharCode(event.charCode);

		if (!pattern.test(inputChar) && event.charCode != '0') {
			event.preventDefault();
		}
	}

	/**
	 * redirct to home after cancel Edit button clicked 
	 */
	cancelEdit() {
		this.router.navigate(['']);
	}
}
