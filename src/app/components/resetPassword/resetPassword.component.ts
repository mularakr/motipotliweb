import { Component, AfterViewInit, Input, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute, Params, NavigationCancel } from '@angular/router';
import { UserServices } from '../register/services/user.service';
import { User } from '../register/models/user';
import { ViewChild, ElementRef } from '@angular/core';
import { URLSearchParams, } from '@angular/http';
import { NgForm } from '@angular/forms';
import { SpinnerService } from '../spinner/spinner.service';
import { CookieService } from 'ngx-cookie-service';
import { Shared, SharedModel } from '../services/shared.service';
import { environment } from "../../../environments/environment";
@Component({
	selector: 'app-resetpassword',
	templateUrl: './resetPassword.component.html',
	providers: [UserServices],
})
export class ResetPasswordComponent implements OnInit {
	@ViewChild('resetClose') resetClose: ElementRef;
	users: User;
	@Input() user;
	resetPasswordForm: FormGroup;
	response: any;
	loading = false;
	msg: any;
	dataArray: any;
	userId: string;
	valid: string;
	salt: any;

	constructor(private sharedservice: Shared, private cookieService: CookieService, private spinner: SpinnerService, private userServices: UserServices, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef) {
		this.resetPasswordForm = this.fb.group({
			'new_pass': ['', Validators.required],
			'conf_pass': ['', Validators.required],
		});
		this.salt = environment.passSalt;

	}

	ngOnInit() {
		// subscribe to router event
		let code = this.route.snapshot.queryParams['code'];
		if (!code) {
			this.router.navigate(['']);
		} else {
			this.checkVerificationKey(code);
		}
	}
	ngAfterViewInit() {
		this.sharedservice.saveData('spin-msg');
	};
	checkVerificationKey(code: any) {
		this.spinner.start();
		this.userServices.checkUserVerificationKey(code)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data'];
				} else {
					if (data['status'] == 'success') {
						this.msg = data['message'];
						this.valid = 'valid';
						this.cookieService.set('VerificationKey', code);
					} else {
						this.msg = data['message'];
					}
				}
			},
			error => {
				// console.log(error);
			});
	}

	resetPassword(formData: any, form: NgForm) {
		this.spinner.start();
		formData['verification_key'] = this.cookieService.get('VerificationKey');
		formData['new_pass'] = this.salt + '%' + window.btoa(formData['new_pass']);
		formData['conf_pass'] = this.salt + '%' + window.btoa(formData['conf_pass']);
		
		this.userServices.resetUserPassword(formData)
			.subscribe(
			data => {
				this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					this.dataArray = data['data'];
				} else {
					if (data['status'] == 'success') {
						this.msg = data['message'];
						form.resetForm();
						this.router.navigate(['/']);
					} else {
						this.msg = data['message'];
					}
				}
			},
			error => {
				// console.log(error);
			});
	}

	cancelReset(form: NgForm) {
		form.resetForm();
		this.router.navigate(['']);
	}
}
