import { Injectable } from '@angular/core'
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ManageList } from './models/managelist';
import { RequestOptions } from '@angular/http';
import { environment } from "../../../environments/environment";
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class ContentServices {
    url: string;
    constructor(private cookieService: CookieService, private http: Http) {
        this.url = environment.apiBaseUrl;
    }


    /**    
    * @function : getAboutUsPageDetails
    * @param NA
    * @description  Get about us page details
    */
    getAboutUsPageDetails(): Observable<ManageList[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(this.url + 'app_getAboutUsPageDetails')
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : gethireWorkersDetails
     * @param NA
     * @description  Get hire Workers Details page details
     */
    gethireWorkersDetails(): Observable<ManageList[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(this.url + 'app_gethireWorkersDetails')
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }


    /**    
     * @function : gethowitworksDetails
     * @param NA
     * @description  Get How it works Details page details
     */
    gethowitworksDetails(): Observable<ManageList[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(this.url + 'app_gethowitworksDetails')
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : getPrivacyPolicies
     * @param NA
     * @description  Get Privacy Policies Details
     */
    getPrivacyPolicies(): Observable<ManageList[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(this.url + 'app_getPrivacyPolicies')
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : gettermsDetails
     * @param NA
     * @description  Get terms  Details page details
     */
    gettermsDetails(): Observable<ManageList[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(this.url + 'app_gettermsDetails')
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : getjobPostContentDetails
     * @param NA
     * @description  Get job PostContent Details
     */
    getjobPostContentDetails(): Observable<ManageList[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(this.url + 'app_getjobPostContentDetails')
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }


    /**    
     * @function : sendContactQuery
     * @param NA
     * @description  send Contact Details
     */
    sendContactQuery(formdata: any): Observable<ManageList[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.post(this.url + 'app_sendContactQuery', formdata)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : getFaqDetailsPageDetails
     * @param NA
     * @description  Get get Faq Details Page 
     */
    getFaqDetailsPageDetails(): Observable<ManageList[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(this.url + 'app_getFaqDetailsPageDetails')
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