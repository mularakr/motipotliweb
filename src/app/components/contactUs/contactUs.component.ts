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
	selector: 'app-contactUs',
	templateUrl: './contactUs.component.html',
	providers: [JobServices, StatecityServices, HomeServices, UserServices, ContentServices],
})
export class ContactUsComponent implements OnInit {
	sendContactForm: FormGroup;
	geoForm: FormGroup;
	userId: string;
	@ViewChild('closeBtn') closeBtn: ElementRef;

	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private meta: Meta, private sanitizer: DomSanitizer, private sharedservice: Shared, private StatecityServices: StatecityServices, private homeService: HomeServices, private cookieService: CookieService, private jobService: JobServices, private spinner: SpinnerService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private userServices: UserServices, private contentServices: ContentServices) {
		this.sendContactForm = this.fb.group({
			'name': ['', Validators.required],
			'email': ['', Validators.required],
			'message': ['', Validators.required],
		});
		this.geoForm = this.fb.group({
			'searchKey': [''],
			'city_id': [''],
			'category_id': [''],
		});
		this.meta.addTags([{ name: 'Contact-us', content: 'Fetch Contact us details.' }]);
	}
	
	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	lat: number;
	lng: number;
	zoom: number

	ngOnInit() {
		this.lat = 17.4139734;
		this.lng = 78.3817617;
		this.zoom = 14;
	}

	/**
	 * Respond after Angular initializes the component's views and child views
	 */
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	}

	/**
	 * Send Query 
	 * @param: formdata
	 * @type:string
	 */
	dataArray: any;
	messageValue: any;
	mydata: any;
	msgClass: string;
	sendContactDetails(formData: any, form: any) {
		this.messageValue = '';
		this.spinner.start();
		this.contentServices.sendContactQuery(formData)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.msgClass = 'success-message';
					this.messageValue = data['message'];
					form.resetForm();
					window.scroll(0, 0);
					setTimeout(() => {
						this.messageValue = null;
					}, 2000);
				} else {
					this.msgClass = 'error-message';
					this.messageValue = data['message'];
					form.resetForm();
					window.scroll(0, 0);
					setTimeout(() => {
						this.messageValue = null;
					}, 2000);
				}
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
