import { Injectable } from '@angular/core'
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { State } from '../models/state';
import { City } from '../models/city';
import { RequestOptions } from '@angular/http';
import { environment } from "../../../../environments/environment";
import { CookieService } from 'ngx-cookie-service';
@Injectable()
export class StatecityServices {
    url: string;
    constructor(private cookieService: CookieService, private http: Http) {
        this.url = environment.apiBaseUrl;
    }
    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', this.cookieService.get('access_token'));
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
    }

    getStateAPI(): Observable<State[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(this.url + 'app_getStates')
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    getCityAPI(id: any): Observable<City[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let body = { id: id };
        return this.http.post(this.url + 'app_getCities', body)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }
    /**
     * Get All Popular City which manage by admin 
     */
    getPopularCity(): Observable<City[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(this.url + 'app_getPopularCity')
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }
    /**
     * Get All Popular City based on state 
     * @param : stateId
     * 
     */
    getPopulerCityByStateAPI(stateID: any): Observable<City[]> {
        let body = { state_id: stateID };
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_populerCityByStateAPI', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    getAllUserCity(stateID: any): Observable<State[]> {
        let body = { state_id: stateID };
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_getAllUserCities', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }


}