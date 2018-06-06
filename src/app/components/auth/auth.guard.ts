import { Injectable, EventEmitter, Output } from '@angular/core';
import {
	Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild,
	NavigationExtras
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthGuard implements CanActivate {
	currentId: any;
	dologin: boolean = false;
	constructor(private activatedRoute: ActivatedRoute, private router: Router, private cookieService: CookieService) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
		let url: string = state.url;
		//get value from url
		let val = url.split('/');
		if (typeof val !== 'undefined') {
			this.currentId = val[2];
		}
		let login = this.cookieService.get('dologin');
		if (login === 'true') {

			var employerUrls = ['/postjob', '/openJob', '/bookedJob', '/editProfile', '/editJob/' + this.currentId, '/editJob', '/company', '/viewEmp/' + this.currentId, '/viewJob/' + this.currentId, '/viewJob', '/makePayment/' + this.currentId, '/paymentStatus/' + this.currentId, '/employerTransactions', '/expiredJob'];
			var employeeUrls = ['/employeeMyJobs', '/viewEmployeeJob/' + this.currentId, '/employeeEdit', '/searchEmployeeJobs', '/myBids', '/employeeTransactions'];

			var openUrls = ['/notification', '/changePassword', '/logout', '/jobByCategory/' + this.currentId, '/geographicalSearch', '/viewJobDetails/' + this.currentId, '/viewEmp/' + this.currentId];//'/jobByCategory/'+this.currentId

			if ((this.cookieService.get('login_type') === 'employer') && (employerUrls.indexOf(url) !== -1)) {

				return true;
			}
			else if ((this.cookieService.get('login_type') === 'employee') && (employeeUrls.indexOf(url) !== -1)) {
				return true;
			}
			else if (openUrls.indexOf(url) !== -1) {
				return true;
			}
			else {
				this.router.navigate(['/']);
			}

			return true;
		} else {
			if (url === '/editProfile') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/changePassword') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/openJob') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/expiredJob') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/bookedJob') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/viewJob/:jobId') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/viewJob') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/employeeEdit') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/editJob/:jobId') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/editJob') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/viewEmp/:empId') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (state.url === '/company') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/employeeMyJobs') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/viewEmployeeJob/:job_Id') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/notification') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/jobByCategory/' + this.currentId) {
				return true;
			} else if (url === '/viewJobDetails/' + this.currentId) {
				return true;
			} else if (url === '/geographicalSearch') {
				return true;
			} else if (url === '/searchEmployeeJobs') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/myBids') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/makePayment/' + this.currentId) {
				return true;
			} else if (url === '/paymentStatus/:txnid') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/employerTransactions') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else if (url === '/employeeTransactions') {
				this.dologin = false;
				this.router.navigate(['/']);
			} else {
				return true;
			}
		}
	}
}