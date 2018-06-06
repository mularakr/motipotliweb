import { Injectable } from '@angular/core'
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { User } from '../models/user';
import { RequestOptions } from '@angular/http';
import { environment } from "../../../../environments/environment";
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class UserServices {
    url: string;
    constructor(private cookieService:CookieService,private http: Http) {
        this.url = environment.apiBaseUrl;
    } 
    /**
     *SignUp with user required details
     *  */

    signUpUser(data: any): Observable<User[]> {

        return this.http.post(this.url + 'app_signUp', data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'server error'))
    }
/**
 * sign in user with Credentials
 */
    signInUser(data: any): Observable<User[]> {
        return this.http.post(this.url + 'app_login', data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'server error'))
    }

    /**
     * Logout User
     */
    logOutUser(data: any,access_token:any,notificationToken:any): Observable<User[]> {
        let body = { id: data, access_token:access_token,notification_token:notificationToken};
        return this.http.post(this.url + 'app_logout', body)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'server error'))
    }
/***
 * Get Uuser details by user id 
 */
    getUserDetailById(id: any): Observable<User[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { id: id };
        return this.http.post(this.url + 'app_GetUserDetailById', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'server error'))
    }
/**
 * change user password
 * @param data 
 */
    changeUserPassword(data: any): Observable<User[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_changepassword', data, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'server error'))
    }
/***
 * Edit user Details
 */
    editUserDetails(data: any): Observable<User[]> {

        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        headers.delete('Content-Type');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_updateprofile', data, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'server error'))        
    }
/**
 * Edit user file
 */
    editUserFile(fileData, id): Observable<any> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        headers.delete('Content-Type');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_updateUserFile?id=' + id, fileData, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'server error'))
    }
/**
 * Edit user Documents file
 * This function not in use 
 */
    editUserDocFile(docFileData, id): Observable<any> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        headers.delete('Content-Type');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_updateUserDocFile?id=' + id, docFileData, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'server error'))
    }
/**
 * Get User Doc details by id
 */
    getUserDocDetailById(id: any): Observable<User[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { id: id };
        return this.http.post(this.url + 'app_GetUserDocDetailById', body, options)
            .map((res: Response) => res.json())           
            .catch((error: any) => Observable.throw(error.json() || 'server error'))
    }
/**
 * Forgot user password 
 */
    forgotUserPassword(data: any): Observable<User[]> {
        return this.http.post(this.url + 'app_forgotpassword', data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'server error'))
    }
/**
 * Chek user Varification key
 */
    checkUserVerificationKey(code: any): Observable<User[]> {
        console.log(code);
        let body = { code: code };
        return this.http.post(this.url + 'app_checkVerificationKey', body)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'server error'))
    }
/**
 * reset user password
 */
    resetUserPassword(data: any): Observable<User[]> {
        return this.http.post(this.url + 'app_resetPassword', data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'server error'))
    }
/**
 * Chek user Activation key for change password
 */

    checkUserActivationKey(code: any): Observable<User[]> {    
        console.log(code);      
        let body={activationKey:code};     
        return this.http.post(this.url+'app_checkUserActivationKey',body)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'server error'))
    }

/**
 * get User Doc Detials if exist
 */
    getUserDocDetails(id: any): Observable<User[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { id: id };
        return this.http.post(this.url + 'app_GetUserDocCount', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'server error12'))
    }
/**
 * get User Notification details
 */
    getUserNotifications(id: any ,type:any): Observable<User[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { id: id,type:type };
        return this.http.post(this.url + 'app_GetUserNotificationById', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'server error'))
    }
/**
 * get count of user notification read/unread
 */
    updateUnreadNotification(id: any): Observable<User[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { id: id };
        return this.http.post(this.url + 'app_updateUnreadNotification', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'server error'))
    }


    /*
    Delete User Doc file
    */
    deleteUserDoc(docID: any): Observable<User[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { id: docID };       
        return this.http.post(this.url + 'app_deleteUserDocFile', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }
 /*
    varifyOtp User Doc file
    */
    varifyOtp(otpdata: any): Observable<User[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
       // let body = { id: docID };       
        return this.http.post(this.url + 'app_varifyOTP',otpdata,options) //1520345230
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    } 
    
    /*
    varifyOtp User Doc file
    */
    regenerateMobileOtp(otpgenerate: any): Observable<User[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { id: otpgenerate };       
        return this.http.post(this.url + 'app_regenerateMobileOTP',body,options) //1520345230
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /*
     update user's Mobile Number
    */
    updateMobileNumber(userDetails: any): Observable<User[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = {    user_id: userDetails.user_id,
                        phone: userDetails.phone
                    };       
        return this.http.post(this.url + 'app_updateMobileForOTP',body,options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }



/**
 * create AuthorizationHeader for evry request
 */
    createAuthorizationHeader(headers: Headers) {        
        headers.append('Authorization', this.cookieService.get('access_token'));
        headers.append('Accept', 'application/json');
        headers.append('Accept', 'application/pdf');
        headers.append('Content-Type', 'application/json');
    }
}