import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Shared, SharedModel } from '../services/shared.service';
import { ContentServices } from '../services/content.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	providers: [ContentServices],
})
export class FooterComponent implements OnInit {
	loginType: any;
	isUserLoggedIn: any;
	contactArray: any;
	dataArray: any;
	message: any;
	mydata: any;
	msgClass: any;
	
	/**
	* constructor
	* this is called by the JavaScript engine
	* rather than Angular
	* dependencies we require 
	*/
	constructor(private sanitizer: DomSanitizer, private sharedservice: Shared, private cookieService: CookieService, private contentServices: ContentServices) {
		this.sharedservice.IsUserLoggedIn.subscribe(value => {
			this.isUserLoggedIn = value;
		});
	}
	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */

	ngOnInit() {
		this.isUserLoggedIn = (this.cookieService.get('login_type') == '') ? null : this.cookieService.get('login_type');
		this.sharedservice.changedHederContent.subscribe(
			(data) => {
				this.getAboutUsDetails()
			}
		)
	}
	/**
	 * Respond after Angular initializes the component's views and child views
	 */
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};

	/**
	   * get user details by id
	   * @param: userId
	   * @type:string
	   */
	getAboutUsDetails() {
		this.message = '';
		if (localStorage.getItem('about') != null) {
			this.dataArray = localStorage.getItem('about');
			let datanew = this.sanitizer.bypassSecurityTrustHtml(this.dataArray);
			this.mydata = datanew['changingThisBreaksApplicationSecurity'].substring(0, 170);
		}

		if (localStorage.getItem('contact') != null) {
			let contactData: any = localStorage.getItem('contact');
			let datanew = this.sanitizer.bypassSecurityTrustHtml(contactData);
			this.contactArray = datanew;
		}
	}
}
