import {Injectable} from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
export interface SharedModel {
    disabledId : any;
    footerLoad : any;
}

@Injectable()
export class Shared {

    SharedComponent: SharedModel = {
        disabledId: '',
        footerLoad: '',
    };
    public IsUserLoggedIn: Subject<any> = new Subject<any>();
    public changedUserNAme: BehaviorSubject<any> = new BehaviorSubject('null');
    public changedHederContent: BehaviorSubject<any> = new BehaviorSubject('null');
    public userLoginType: BehaviorSubject<any> = new BehaviorSubject('null');
        
    saveData(str: any){
        this.SharedComponent.disabledId=str;
    }
    getData(): any{
        return this.SharedComponent.disabledId;
    }

    constructor() {
    }
}