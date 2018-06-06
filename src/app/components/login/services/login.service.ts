import { Injectable } from '@angular/core'
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Login } from '../models/login';
import { environment } from "../../../../environments/environment";

@Injectable()
export class LoginServices { 
    url: string;      
    constructor(private http: Http) {
        this.url = environment.apiBaseUrl;
    }
    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', btoa('authKey'));
        headers.append('Accept', 'application/json');
        headers.append('Accept', 'application/pdf');
        headers.append('Content-Type', 'application/json');
    }

    signInUser(data: any): Observable<Login[]> {      
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.post(this.url+'app_login', data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }



}