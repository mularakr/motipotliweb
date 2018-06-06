import { Component, AfterViewInit, Input, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserServices } from '../register/services/user.service';
import { User } from '../register/models/user';
import { ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SpinnerService } from '../spinner/spinner.service';
import { Shared, SharedModel } from '../services/shared.service';
import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-forgotpassword',
	templateUrl: './forgotPassword.component.html',
	providers: [UserServices],
})
export class ForgotPasswordComponent implements OnInit {
	@ViewChild('forgotClose') forgotClose: ElementRef;
	users: User;
	@Input() user;
	forgotPasswordForm: FormGroup;
	response: any;
	loading = false;
	msg: any;
	dataArray: any;
	userId: string;
	valid: string;

	/**
	 * constructor
	 * this is called by the JavaScript engine
	 * rather than Angular
	 * dependencies we require 
	 */
	constructor(private meta: Meta, private sharedservice: Shared, private spinner: SpinnerService, private userServices: UserServices, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef) {
		this.forgotPasswordForm = this.fb.group({
			'email': ['', Validators.required],
		});
		this.meta.addTags([{ name: 'forgot-password', content: 'The forgot password recover functionalities.' }]);
	}

	/**
	 * ngOnInit called on demand by Angular
	 * initialising the component.
	 */
	ngOnInit() {
	}
	/**
	 * Respond after Angular initializes the component's views and child views
	 */
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};
	/**
	 * Forgot password 
	 */
	forgotPassword(formData: any, form: NgForm) {
		this.spinner.start();
		this.userServices.forgotUserPassword(formData)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data'];
				} else {
					if (data['status'] == 'success') {
						form.resetForm();
						alert(data['message']);
						this.forgotClose.nativeElement.click();
						this.valid = 'valid';
					} else {
						this.msg = data['message'];
						form.resetForm();
					}
				}
			},
			error => {
				// console.log(error);
			});
	}

	cancelForgot() {
		this.router.navigate(['']);
	}
}
