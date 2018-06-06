import { Component, Input, Output, OnInit, trigger, state, style, ChangeDetectorRef, ChangeDetectionStrategy, transition, animate, Renderer2, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { OwlCarousel } from 'ng2-owl-carousel';
import { HomeServices } from './home.service';
import { Home } from './home';
import { StatecityServices } from '../register/services/statecity.service';
import { State } from '../register/models/state';
import { CookieService } from 'ngx-cookie-service';
import { SpinnerService } from '../spinner/spinner.service';
import { environment } from "../../../environments/environment";
import { Shared, SharedModel } from '../services/shared.service';
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	providers: [StatecityServices, HomeServices, SpinnerService],
})
export class HomeComponent implements OnInit, AfterViewInit {
	homes: Home[];
	states: State[];
	temp: any;
	msg: any;
	statesArray: any;
	cityArray: any;
	errormsg: string;
	url: string;
	geoForm: FormGroup;
	@ViewChild('owlElement') owlElement: OwlCarousel;
	@ViewChild('closeBtn') closeBtn: ElementRef;
	@ViewChild('closeBtn') closeBtn1: ElementRef;
	userId: string; //user Id
	loginType: any; // get user login type
	displayValue: string;
	isUserLoggedIn: any;

	//Drop Down for category
	dropdownList = [];
	selectedItems: any = [];
	dropdownSettings = {};

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

	@ViewChild('open') open: ElementRef;
	constructor(private meta: Meta, private cookieService: CookieService, private sharedservice: Shared, private spinner: SpinnerService, private homeService: HomeServices, private StatecityServices: StatecityServices, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private renderer: Renderer2, private http: Http) {
		this.geoForm = this.fb.group({
			'searchKey': [''],
			'city_id': [''],
			'category_id': [''],
		});

		this.sharedservice.IsUserLoggedIn.subscribe(value => {
			this.isUserLoggedIn = value;
		});
		this.meta.addTags([{ name: 'home-page', content: 'Fetch home page details.' }]);
	}

	fun() {
		this.owlElement.next([200])
	}

	ngOnInit() {
		if (this.cookieService.get('userId') != null) {
			this.userId = this.cookieService.get('userId');
			this.loginType = this.cookieService.get('login_type');

		} else {
			this.loginType = null;
			this.userId = null;
		}
		this.isUserLoggedIn = (this.cookieService.get('login_type') == '') ? null : this.cookieService.get('login_type');
		this.getAllCategory();
		this.getAllPopularCities();

		//Drop Down for Category
		this.dropdownSettings = {
			singleSelection: false,
			text: "--Categories--",
			selectAllText: 'Select All',
			unSelectAllText: 'UnSelect All',
			enableSearchFilter: true,
			classes: "myclass custom-class",
			badgeShowLimit: 1

		};

	}

	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	}

	ngOndestroy() {
		this.closeBtn.nativeElement.click();
		this.closeBtn1.nativeElement.click();
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
					this.cityArray = data['data'];
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
					data['data'].forEach((elem, i) => {
						this.dropdownList.push({ "id": elem.id, "itemName": elem.name });
					});
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
	 * Get geographical Search form data
	 * {"searchKey":"","city_id":"","category_id":["6","4","5"],"userId":"","flag":"1"}
	 */
	geoFormData(formData: any) {
		let formArray: any = [];
		if (this.userId != null) {
			formData["userId"] = this.userId;
		} else {
			formData["userId"] = '';
		}
		formData["flag"] = '1';
		this.closeBtn.nativeElement.click();
		//category Array
		formData['category_id'].forEach((elem, i) => {
			formArray.push(elem.id);
		});

		formData['category_id'] = [];
		formData['category_id'] = formArray;

		sessionStorage.setItem('geo_search', JSON.stringify(formData));
		this.router.navigate(['/geographicalSearch']);

	}
	title = 'MotiPotli1';
	newimages: Array<string> = ['img_1.png', 'img_2.png', 'img_3.png', 'img_4.png', 'img_5.png', 'img_6.png', 'img_1.png', 'img_2.png', 'img_3.png', 'img_4.png', 'img_5.png', 'img_6.png'];
	caption: Array<string> = ['a', 'b', 'c', 'd', 'e', 'f', 'img_1.png', 'img_2.png', 'img_3.png', 'img_4.png', 'img_5.png', 'img_6.png'];
}
