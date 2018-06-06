import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { RequestOptions } from '@angular/http';
import { environment } from "../../../environments/environment";
import { CookieService } from 'ngx-cookie-service';

/**
 * This is Injectable allows the user the firebase functionalities.
 * 
 * @export
 * @class MessagingService
 */
@Injectable()
export class MessagingService {

	messaging = firebase.messaging();
	//behaviour sbject to trigger the bage count increament on firebase notification 
	currentMessage = new BehaviorSubject(null);
	url: any;
	notification_token: any;
	
	constructor(private db: AngularFireDatabase, private cookieService: CookieService, private afAuth: AngularFireAuth, private http: Http) {
		this.url = environment.apiBaseUrl;
	}

	/**
	 * 
	 * @param headers 
	 * @desc Sets headers with the Authorization, Accept, Content-Type
	 */
	createAuthorizationHeader(headers: Headers) {
		headers.append('Authorization', this.cookieService.get('access_token'));
		headers.append('Accept', 'application/json');
		headers.append('Accept', 'application/pdf');
		headers.append('Content-Type', 'application/json');
	}

	/**
	 * 
	 * @param token 
	 * @desc updates token at the firebase db if required.
	 */
	updateToken(token: any) {
		this.afAuth.authState.take(1).subscribe(user => {
			if (!user) return;

			const data = { [user.uid]: token }
			this.db.object('fcmTokens/').update(data)
		})
	}

	/**
	 * 
	 * @param userId 
	 * @param curUrl 
	 * @desc get the browser permission to access notification 
	 * 		 if yes then generates FCM token/
	 */
	getPermission(userId: any, curUrl: any = null) {
		this.messaging.requestPermission()
			.then(() => {
				return this.messaging.getToken()
			})
			.then(token => {
				if (token != this.cookieService.get('notificationToken')) {
					this.postToken(userId, token)
						.subscribe(
						data => {
							if (curUrl != null) {
								window.location.assign(curUrl);
							}
						},
						error => { //console.log(error)
						}
						)
					this.updateToken(token);
				}
			})
			.catch((err) => {
				// console.log('Unable to get permission to notify.', err);
			});
	}

	/**
	 * @desc Triggers when the FCM notification occurs
	 */
	receiveMessage() {
		try {
			this.messaging.onMessage((payload) => {
				this.currentMessage.next(payload);
			});
			navigator.serviceWorker.addEventListener('error', () => { throw 'firebase Exception'; });
			navigator.serviceWorker.addEventListener('message', (event) => {
				this.currentMessage.next(event.data);
			});
		} catch (e) {
			// console.log(e);
		}
	}
	/**
	 * 
	 * @param userId 
	 * @param token 
	 * @desc saves token against user in databse.
	 */
	postToken(userId: any, token: any): Observable<any> {

		this.cookieService.set('notificationToken', token);
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let options = new RequestOptions({ headers: headers });
		let body = {
			"user_id": userId,
			"device_token": token,
			"device_type": 'web'
		}
		return this.http.post(this.url + 'app_userTokenForNotification', body, options)
			.map((res: Response) => res.json())
			.catch((error: any) => Observable.throw(error.json().error || 'server error'));
	}
}