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
import { ContentServices } from '../services/content.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';
@Component({
	selector: 'app-howitworks',
	templateUrl: './howitworks.component.html',
	providers: [JobServices, StatecityServices, HomeServices, UserServices, ContentServices],
})
export class HowItWorksComponent implements OnInit {
	geoForm: FormGroup;
	userId: string;
	isUserLoggedIn: any;
	dataArray: any;
	message: any;
	mydata: any;
	msgClass: any;
	@ViewChild('closeBtn') closeBtn: ElementRef;

	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private meta: Meta, private sanitizer: DomSanitizer, private sharedservice: Shared, private StatecityServices: StatecityServices, private homeService: HomeServices, private cookieService: CookieService, private jobService: JobServices, private spinner: SpinnerService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private userServices: UserServices, private contentServices: ContentServices) {
		this.geoForm = this.fb.group({
			'searchKey': [''],
			'city_id': [''],
			'category_id': [''],
		});
		this.meta.addTags([{ name: 'how-it-works', content: 'how it works.' }]);
	}

	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() {
		this.userId = this.cookieService.get('userId');
		this.gethowitworksDetails();
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
	gethowitworksDetails() {
		this.message = '';
		this.spinner.start();
		this.contentServices.gethowitworksDetails()
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data'];
					let datanew = this.sanitizer.bypassSecurityTrustHtml(this.dataArray['content']);
					this.mydata = datanew['changingThisBreaksApplicationSecurity'];
					if (this.mydata == '') {
						this.msgClass = 'error-message';
						this.message = 'no record found';
					}
				} else {
					this.msgClass = 'error-message';
					this.message = data['message'];
					//console.log(this.message);
				}
			},
			error => {
				//console.log(JSON.stringify(error.message));	
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
