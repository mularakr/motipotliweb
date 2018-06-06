import { Component, Input, OnInit, trigger, state, style, transition, animate,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder,FormsModule, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserServices } from '../register/services/user.service';
import { User } from '../register/models/user';
import { ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SpinnerService } from '../spinner/spinner.service';
import { CookieService } from 'ngx-cookie-service';
import { Shared,SharedModel } from '../services/shared.service';
import { environment } from "../../../environments/environment";
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-changePassword',
  templateUrl: './changePassword.component.html',
  providers: [UserServices],  
})
export class ChangePasswordComponent implements OnInit {

  users: User;
  @Input() user;
  changePasswordForm: FormGroup;
  response: any;
  loading = false;
  msg: any;
  dataArray: any;
  userId:string;
  msgClass:string;
  salt:any;
  /**
   * constructor
   * this is called by the JavaScript engine
   * rather than Angular
   * dependencies we require 
   */
  constructor(private sharedservice: Shared,private cookieService:CookieService,private spinner: SpinnerService,private userServices: UserServices, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef,private meta : Meta) {
    this.changePasswordForm = this.fb.group({
      'old_pass': ['', Validators.required],
      'new_pass': ['', Validators.required],
      'conf_pass': ['', Validators.required],     
    });
    this.salt = environment.passSalt;
    this.meta.addTags([{ name: 'ChangePassword', content: 'Component to change password functionality.' }]);
  }    
  
  /**
   * ngOnInit called on demand by Angular
   * initialising the component.
   */
  login_type:any;
  ngOnInit() {	
    this.userId= this.cookieService.get('userId');
    this.login_type= this.cookieService.get('login_type');
    //console.log(this.login_type);
    //this.userId= sessionStorage.getItem('userId');
    if(!this.userId)
    {
      this.router.navigate(['']);
    }
  }
  
  /**
   * Respond after Angular initializes the component's views and child views
   */
  ngAfterViewInit(){
    this.sharedservice.saveData('spin-msg');            
  };


  /**
	 * change user Password
	 * @argument formData
	 * 
	 */
changePassword(formData: any,form: NgForm) {
  
  /*let val=window.btoa(formData['password']);
  let salt=this.salt+'%'+val;    
  formData['password']=salt;*/
  formData['old_pass']=this.salt+'%'+window.btoa(formData['old_pass']);
  formData['new_pass']=this.salt+'%'+window.btoa(formData['new_pass']);
  formData['conf_pass']=this.salt+'%'+window.btoa(formData['conf_pass']);


  this.spinner.start();
  formData['user_id']=this.userId; 
  this.userServices.changeUserPassword(formData)
    .subscribe(
    data => {
      this.spinner.stop();
      if (typeof data['data'] !== 'undefined') {
        this.dataArray = data['data'];
      } else {
        if (data['status'] == 'success') {
          this.msg = data['message'];
          this.msgClass = 'success-message';
          //alert(data['message']);
          form.resetForm();
          setTimeout(()=>{    
						this.msg = null;						
            },3000);            
          //this.changePasswordForm.reset(); 
          //console.log(this.msg);
        } else {
          this.msg = data['message'];
          this.msgClass='error-message';
          setTimeout(()=>{    
						this.msg = null;						
            },3000);         
        }
      }  
    },
    error => {
      // console.log(error);
    });
}
 /**
  * Redirect to home page if user press the cancel button
  */
cancelchange()
{
  this.router.navigate(['/']);
}


}
