import { Component,AfterViewInit, Input, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { FormGroup, FormBuilder,FormsModule, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute ,Params,NavigationCancel} from '@angular/router';
import { UserServices } from '../register/services/user.service';
import { User } from '../register/models/user';
import { ViewChild, ElementRef } from '@angular/core';
import { URLSearchParams, } from '@angular/http';
import { NgForm } from '@angular/forms';
import { SpinnerService } from '../spinner/spinner.service';
import { Shared,SharedModel } from '../services/shared.service';

@Component({
  selector: 'app-useractivation',
  templateUrl: './userActivation.component.html',
  providers: [UserServices],  
})
export class UserActivationComponent implements OnInit {

  users: User;
  @Input() user;
  response: any;
  loading = false;
  msg: any;
  valid:string;
  dataArray:string;

  constructor(private sharedservice: Shared,private spinner: SpinnerService,private userServices: UserServices, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef) {
    /*this.resetPasswordForm = this.fb.group({   
      'new_pass': ['', Validators.required],
      'conf_pass': ['', Validators.required],     
    });*/

   /* router.events.subscribe(s => {
      if (s instanceof NavigationCancel) {
        let params = new URLSearchParams(s.url.split('?')[1]);
        let access_token = params.get('access_token');
        let code = params.get('code');
        console.log(code);
      }
    });*/

  }    
  
  ngOnInit() {
    // subscribe to router event
    let code= this.route.snapshot.queryParams['code'];   
    if (!code) {
      this.router.navigate(['']);			
    }else{
      this.checkUserActivation(code);
    }
  }
  
  ngAfterViewInit(){
    this.sharedservice.saveData('spin-msg');            
  };

  checkUserActivation(code: any) {    
    this.spinner.start();
		this.userServices.checkUserActivationKey(code)
			.subscribe(
			data => {
        this.spinner.stop();
				if (typeof data['data'] !== 'undefined') {
					 this.dataArray = data['data'];
				} else {         
          if (data['status'] == 'success') {
            this.msg = data['message'];  
            this.valid='valid';
            setTimeout(()=>{    
              this.msg = null;
              this.router.navigate(['']);		
            },4000);           
          } else {
            this.msg = data['message'];
            setTimeout(()=>{    
              this.msg = null;
              this.router.navigate(['']);		
            },4000);
          }
				}

			},
			error => {
				// console.log(error);
			});
  }

  /*checkVerificationKey(code: any) {    
		this.loading = true;
		this.userServices.checkUserVerificationKey(code)
			.subscribe(
			data => {
				if (typeof data['data'] !== 'undefined') {
					 this.dataArray = data['data'];
				} else {         
          if (data['status'] == 'success') {
            this.msg = data['message'];  
            this.valid='valid';
            sessionStorage.setItem('VerificationKey', code);
            console.log(this.msg);
          } else {
            this.msg = data['message'];
            console.log(this.msg);
          }
				}

			},
			error => {
				console.log(error);
			});
  }*/
  
/*resetPassword(formData: any,form: NgForm) {
  this.loading = true;
  formData['verification_key']=sessionStorage.getItem('VerificationKey');
  this.userServices.resetUserPassword(formData)
    .subscribe(
    data => {
      if (typeof data['data'] !== 'undefined') {
        this.dataArray = data['data'];
      } else {
        if (data['status'] == 'success') {
          this.msg = data['message'];
          form.resetForm();
         // this.resetPasswordForm.reset();               
          console.log(this.msg);
        } else {
          this.msg = data['message'];
          console.log(this.msg);
        }
      }  
    },
    error => {
      console.log(error);
    });
}*/
 
cancelReset()
{
  this.router.navigate(['']);
}



}
