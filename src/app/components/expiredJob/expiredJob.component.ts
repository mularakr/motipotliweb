import { Component,AfterViewInit, Input, Output, OnInit, OnDestroy, trigger, state, style, ChangeDetectorRef, ChangeDetectionStrategy, transition, animate, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray } from '@angular/forms';
import { CompanyServices } from '../postjob/services/company.service';
import { JobServices } from '../postjob/services/job.service';
import { Company } from '../postjob/models/company';
import { Job } from '../postjob/models/job';
import { NgForm } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SpinnerService } from '../spinner/spinner.service';
import { IMyDrpOptions, IMyDateRangeModel, IMyDateRange, IMyInputFieldChanged, IMyCalendarViewChanged, IMyDateSelected } from 'mydaterangepicker';
import { DatePipe } from '@angular/common';
import { Shared,SharedModel } from '../services/shared.service';
import { environment } from "../../../environments/environment";
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-expiredJob',
  templateUrl: './expiredJob.component.html',
  providers: [JobServices, CompanyServices, DatePipe],
})

export class ExpiredJobComponent implements OnInit {
  companies: Company[];
  jobs: Job[];
  userId: string;
  msg: string;
  dataArray: any[];
  delMsg: any;
  companyMsg: any;
  modelDateArray: any = {};
  msgClass:string;
  shareBaseUrl:any=[];
  jobsArray:any=[];
  urlShare: string;
  delJobMsg:any;
  dateArray: any = {};
  las: any;
  p: number = 1;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeFilter') closeFilter: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  /**
   * Date picker options
   */
  myDateRangePickerOptions: IMyDrpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy', //yyyy-mm-dd
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    inline: true,   
    showClearBtn:true,

  };
  //form group name 
  myForm: FormGroup;
  /**
   * constructor
   * this is called by the JavaScript engine
   * rather than Angular
   * dependencies we require 
   */
  constructor(private meta : Meta, private sharedservice: Shared,private cookieService: CookieService, private companyServices: CompanyServices, private jobService: JobServices, private spinner: SpinnerService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private myElement: ElementRef, private renderer: Renderer2, private datePipe: DatePipe) {
    this.myForm = this.fb.group({     
      myDateRange: ['', Validators.required]      
    });
    this.urlShare = environment.shareBaseUrl;
    this.meta.addTags([{ name: 'expired-jobs', content: 'list out expired jobs.' }]);
  }

  /**
   * ngOnInit called on demand by Angular
   * initialising the component.
   */
  ngOnInit() {
    //get current user id
    this.userId = this.cookieService.get('userId');
    if (this.userId) {
      this.getExpiredJobDetailsByUserId(this.userId);
    }
    if (this.userId) {
      this.getCompanyDetailByUserId(this.userId);
    }
   this.modelDateArray.start ='--/--/----';
   this.modelDateArray.end = '--/--/----';
  }
  
  ngOnDestroy(){
    this.closeBtn1.nativeElement.click();
    this.closeFilter.nativeElement.click();
  }

  ngAfterViewInit(){
    this.sharedservice.saveData('spin-msg');            
  };
  /**
   * Get All Job details related to current user
   * @param userId 
   * Function:getOpenJobDetailsByUserId
   * Date:
   * Description:Get All  open jobs  details
   */
  getExpiredJobDetailsByUserId(uId: any) {    
    this.spinner.start();
    this.jobService.getExpiredJobs(uId)
      .subscribe(
      data => {
        this.spinner.stop();
        if (typeof data['data'] !== 'undefined') {
          this.jobs = data['data'];
        } else {
          if (data['status'] == 'success') {
            this.msg = data['message'];
          } else {
            this.msgClass = 'error-message';
            this.msg = data['message'];
          }
        }
      }
      )
  }


  /**
   * get company details by company id
   */
  onSelect(companyId: any) {
    if (companyId != '') {
      this.spinner.start();
      this.jobService.getExpiredJobByCompanyId(companyId, this.userId)
        .subscribe(
        data => {
          this.spinner.stop();
          if (typeof data['data'] !== 'undefined') {
            this.jobs = data['data'];
            this.companyMsg = null;
          } else {
            if (data['status'] == 'success') {
            } else {
              this.jobs = null;
              this.delMsg = null;
              this.msgClass='error-message';
              this.msg = data['message'];              
            }
          }
        }
        )
    } else {
      this.getExpiredJobDetailsByUserId(this.userId);
    }

  }

  /**
   * Get All company details related to current user
   * @param userId 
   */
  getCompanyDetailByUserId(userId: any) {
    this.companyServices.getUserCompany(userId)
      .subscribe(
      data => {
        if (typeof data['data'] !== 'undefined') {
          this.companies = data['data'];
        } else {
          if (data['status'] == 'success') {
          } else {
            // alert(data['message']);
          }
        }
      }
      )
  }

  /**
   * Date range function
   */
  setDateRange(): void {
    // Set date range (today) using the patchValue function
    let date = new Date();
    this.myForm.patchValue({
      myDateRange: {
        beginDate: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        },
        endDate: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
      }
    });
  }

  clearDateRange(): void {  
    // Clear the date range using the patchValue function
    this.myForm.patchValue({ myDateRange: '' });  
  }

  /**
   * On Change date function 
   */
  onDateRangeChanged(event: IMyDateRangeModel) {
   
    //If user search data based on calendar date range select
    if(event.formatted !=''){
          
      let dateStart = event.formatted.split(" ")[0];
      let dateEnd = event.formatted.split(" ")[2];
      this.modelDateArray.start = dateStart;
      this.modelDateArray.end = dateEnd;
      this.dateArray['start'] = dateStart;
      this.dateArray['end'] = dateEnd;    
      this.getExpiredJobDetailsByCalendar(this.dateArray);

    }else{

      //Data search if user reset date range 
      var date = new Date();
      this.getExpiredJobDetailsByUserId(this.userId);
      this.modelDateArray.start ='--/--/----';
      this.modelDateArray.end = '--/--/----';
    }
 
  }

  /**
   * Get Jobs details by calendar date
   */
  getExpiredJobDetailsByCalendar(dateAray: any) {
    dateAray['user_id'] = this.userId;
    if (dateAray != '') {
      this.spinner.start();
      this.jobService.getExpiredJobsByCalendar(dateAray)
        .subscribe(
        data => {
          this.spinner.stop();
          if (typeof data['data'] !== 'undefined') {
            this.jobs = data['data'];
          } else {
            if (data['status'] == 'success') {
            } else {
              this.jobs = null;
              this.delMsg = null;
              this.msgClass='error-message';
              this.msg = data['message'];
            }
          }
        }
        )
    } else {
      this.getExpiredJobDetailsByUserId(this.userId);
    }
  }

  deleteJob(isdelete){
  }
}//end class
