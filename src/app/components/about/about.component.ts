import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../spinner/spinner.service';
import { CookieService } from 'ngx-cookie-service';
import { NgForm } from '@angular/forms';
import { environment } from "../../../environments/environment";
import { Shared, SharedModel } from '../services/shared.service';
import { ContentServices } from '../services/content.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	providers: [ContentServices],
})
export class AboutComponent implements OnInit {
	geoForm: FormGroup;
	userId: string;
	dataArray: any;//contain array details 
	message: any;//flash message details
	mydata: any;//Contain data
	msgClass: any;	//set message details
	@ViewChild('closeBtn') closeBtn: ElementRef;

	//constructor this is called by the JavaScript engine rather than Angular dependencies we require 	 
	/**
	 * Creates an instance of AboutComponent.
	 * @param {ContentServices} contentServices 
	 * @param {ElementRef} myElement 
	 * @param {ActivatedRoute} route 
	 * @param {SpinnerService} spinner
	 * @param {Router} router 
	 * @param {CookieService} cookieService 
	 * @param {Shared} sharedservice 
	 * @param {sanitizer} DomSanitizer //used for display HTML data
	 * @memberof AboutComponent
	 */
	constructor(private sanitizer: DomSanitizer, private sharedservice: Shared, private cookieService: CookieService, private spinner: SpinnerService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private contentServices: ContentServices, private meta: Meta) {
		this.geoForm = this.fb.group({
			'searchKey': [''],
			'city_id': [''],
			'category_id': [''],
		});

		this.meta.addTags([{ name: 'about-us', content: 'Fetch about us details.' }]);
	}

	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() {
		this.getAboutUsDetails();
	}

	/**
	 * Respond after Angular initializes the component's views and child views
	 */
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};


	/**
	 * @memberof AboutComponent
	 * @method:getAboutUsDetails()
	 * @param: NA
	 * @requires:NA
	 * @returns:string
	 * @description: Fetch about us details.
	 */
	getAboutUsDetails() {
		this.message = '';
		this.spinner.start();
		this.contentServices.getAboutUsPageDetails()
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data']['about'];
					let datanew = this.sanitizer.bypassSecurityTrustHtml(this.dataArray['content']);
					this.mydata = datanew['changingThisBreaksApplicationSecurity'];
					if (this.mydata == '') {
						this.msgClass = 'error-message';
						this.message = 'no record found';
					}
				} else {
					this.msgClass = 'error-message';
					this.message = data['message'];
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
		if (this.userId != null) {
			formData["userId"] = this.userId;
		} else {
			formData["userId"] = '';
		}
		formData["flag"] = '1';
		this.closeBtn.nativeElement.click();
		sessionStorage.setItem('geo_search', JSON.stringify(formData));
		this.router.navigate(['/geographicalSearch']);
	}

}
