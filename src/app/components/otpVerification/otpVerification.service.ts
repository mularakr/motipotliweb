import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/share';

@Injectable()
export class otpVerificationService {
  public popstatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _active: boolean = false;

  public get active(): boolean {
    return this._active;
  }

  public set active(v: boolean) {
    this._active = v;
    this.popstatus.next(v);
  }

  public openPop(): void {
    this.active = true;
  }

  public closePop(): void {
    this.active = false;
  }
}
