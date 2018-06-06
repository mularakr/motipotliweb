import { Injectable } from '@angular/core'
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Home } from './home';
import { environment } from "../../../environments/environment";

@Injectable()
export class HomeServices {
    url: string;  
    constructor(private http: Http) {        
        this.url = environment.apiBaseUrl;        
    }
    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', btoa('authKey'));
    }
    getCategoryAPI(): Observable<Home[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(this.url+'app_getCategories')
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }    
   
}