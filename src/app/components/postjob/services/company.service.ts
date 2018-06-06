import { Injectable } from '@angular/core'
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Company } from '../models/company';
import { RequestOptions } from '@angular/http';
import { environment } from "../../../../environments/environment";
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class CompanyServices {
    url: string;
    constructor(private cookieService: CookieService, private http: Http) {
        this.url = environment.apiBaseUrl;
    }
    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', this.cookieService.get('access_token'));
        headers.append('Accept', 'application/json');
        headers.append('Accept', 'application/pdf');
        headers.append('Content-Type', 'application/json');
    }

    /*
    * Get Company by logged in user id
    */
    getUserCompany(currentUserId: any): Observable<Company[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { userId: currentUserId };
        return this.http.post(this.url + 'app_getCompanyDetailByCurrentUserId', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /*
    * Get Company by logged in user id without personal array
    */
    getUserCompany1(currentUserId: any): Observable<Company[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { userId: currentUserId };
        return this.http.post(this.url + 'app_getCompanyDetailByCurrentUserId1', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /*
    * Get Company by address by company id 
    */
    getCompanyAddress(companyId: any): Observable<Company[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { company_id: companyId };
        return this.http.post(this.url + 'app_getCompanyAddress', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    addCompany(data: any): Observable<Company[]> {

        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        headers.delete('Content-Type');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_addCompany', data, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**
     * getCompanyDetailById
     */
    getCompanyDetailById(id: any): Observable<Company[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { company_id: id };
        return this.http.post(this.url + 'app_getCompanyAddress', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }


    /*
     * Delete Company details
     */
    deleteCompany(deleteCompanyId: any): Observable<Company[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { id: deleteCompanyId };
        return this.http.post(this.url + 'app_deleteCompanyDetails', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**
     * getCompanyDocById
     */
    getCompanyDocById(id: any): Observable<Company[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { company_id: id };
        return this.http.post(this.url + 'app_getCompanyDocuments', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }



    /*
    Delete Company details
    */
    deleteCompanyDoc(docID: any): Observable<Company[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { id: docID };
        return this.http.post(this.url + 'app_deleteCompanyDocDetails', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }
}