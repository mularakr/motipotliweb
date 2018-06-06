import { Injectable } from '@angular/core'
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Job } from '../models/job';
import { RequestOptions } from '@angular/http';
import { environment } from "../../../../environments/environment";
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class JobServices {
    url: string;
    MyArray: any = [];
    constructor(private cookieService: CookieService, private http: Http) {
        this.url = environment.apiBaseUrl;
    }

    /**    
      * @function : postJob
      * @param Form Fields     
      * Save post job details
      * Employer
      */
    postJob(formData: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        headers.delete('Content-Type');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_jobPost', formData, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : getOpenJobs
     * @param Form current User Id     
     * @description  Get All open jobs by logged in user id
     */
    getOpenJobs(currentUserId: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { id: currentUserId };
        return this.http.post(this.url + 'app_GetOpenJobs', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
    * @function : getExpiredJobs
    * @param Form current User Id     
    * @description  Get All Expired  jobs by logged in user id
    */
    getExpiredJobs(currentUserId: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { id: currentUserId };
        return this.http.post(this.url + 'app_GetExpiredJobs', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : cancelJob
     * @param Form Job Id     
     * @description  Delete/cancel Job details
     */
    cancelJob(deleteJobId: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { id: deleteJobId };
        return this.http.post(this.url + 'app_deleteJobDetails', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }


    /**    
     * @function : cancelJob
     * @param  currentUserId
     * @description   Get All Booked jobs by logged in user id
     */
    getBookedJobs(currentUserId: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { id: currentUserId };
        return this.http.post(this.url + 'app_GetBookedJobs', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }


    /**    
    * @function : getJobDetails
    * @param jobId
    * @description   Get  job details by jobId
    */
    getJobDetails(jobId: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { jobId: jobId };
        return this.http.post(this.url + 'app_GetJobDetails', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : editJob
     * @param editData
     * @description Edit Job post data
     */
    editJob(editData: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        headers.delete('Content-Type');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_editPost', editData, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : getJobBidDetails
     * @param job_Id
     * @description  Get job bid details by id
     */
    getJobBidDetails(job_Id: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { jobId: job_Id };
        return this.http.post(this.url + 'app_GetJobBidDetails', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : getAcceptBidDetails
     * @param job_Id
     * @description   Get accept job bid details by id
     */
    getAcceptBidDetails(job_Id: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { jobId: job_Id };
        return this.http.post(this.url + 'app_GetAcceptBidDetails', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : getJobByCompanyId
     * @param companyId
     * @description   Get job details by Company id
     */
    getJobByCompanyId(companyId: any, uId: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { companyid: companyId, uId: uId };
        return this.http.post(this.url + 'app_GetJobDetailsByCompanyId', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : getExpiredJobByCompanyId
     * @param companyId
     * @description   Get job details by Company id     
     */
    getExpiredJobByCompanyId(companyId: any, uId: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { companyid: companyId, uId: uId };
        return this.http.post(this.url + 'app_GetExpiredJobDetailsByCompanyId', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }


    /**    
     * @function : getBookedJobByCompanyId
     * @param companyId
     * @description  get Booked Job By CompanyId
     */
    getBookedJobByCompanyId(companyId: any, uId: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { companyid: companyId, uId: uId };
        return this.http.post(this.url + 'app_GetBookedJobDetailsByCompanyId', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    //This function not in use
    /**    
     * @function : getEmployeeJobsByCategoryId
     * @param detailArray
     * @description  get Employee Jobs By CategoryId
     */
    getEmployeeJobsByCategoryId(detailArray: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_getEmployeeJobsByCategoryId', detailArray, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }


    /**    
     * @function : getEmployeeMyJobs
     * @param myId
     * @description  Get All Employee my jobs by user id
     */
    getEmployeeMyJobs(myId: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { user_id: myId };
        return this.http.post(this.url + 'app_getEmployeeMyJobs', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : getJobsByCategoryId
     * @param arrayValue
     * @description  Get All Jobs By CategoryId
     */
    getJobsByCategoryId(arrayValue: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.post(this.url + 'app_getJobsByCategoryId', arrayValue)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : getUserBidDetails
     * @param job_Id,User_id
     * @description  Get User bid details by job_Id,User_id
     */
    getUserBidDetails(job_Id: any, User_id: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { jobId: job_Id, UserId: User_id };
        return this.http.post(this.url + 'app_GetUserJobBidDetails', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }


    /**    
    * @function : placeUserBid
    * @param FormData
    * @description Place Bid by employeee
    */
    placeUserBid(formData: any): Observable<Job[]> {
        // console.log(formData);
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_placeBid', formData, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }


    /**    
     * @function : bidAcceptRejectData
     * @param data
     * @description bid Accept/Reject by employer
     */
    bidAcceptRejectData(data: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_bidAcceptRejectData', data, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : getJobDetailsforGuestUser
     * @param jobId
     * @description get Job Details for Guest User search
     */
    getJobDetailsforGuestUser(jobId: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let body = { jobId: jobId };
        return this.http.post(this.url + 'app_GetJobDetailsForGuest', body)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }



    /**    
     * @function : getOpenJobsByCalendar
     * @param dateArray
     * @description  Get All open jobs by calender date range
     *
     */
    getOpenJobsByCalendar(dateArray: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_GetOpenJobsByCalendar', dateArray, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : deleteJobImage
     * @param imageId
     * @description Delete single Job Image
     *
     */
    deleteJobImage(imageId: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { id: imageId };
        return this.http.post(this.url + 'app_deleteJobImage', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
    * @function : getBookedJobsByCalendar
    * @param dateArray
    * @description   Get All booked jobs by calender date
    *
    */
    getBookedJobsByCalendar(dateArray: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_GetBookedJobsByCalendar', dateArray, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : getOpenJobsForEmployeeByCalendar
     * @param dateArray
     * @description   Get All open jobs by calender date for Employee
     *
     */
    getOpenJobsForEmployeeByCalendar(dateArray: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_GetOpenJobsForEmployeeByCalendar', dateArray, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }
    /**    
   * @function : getJobsForEmployeeByCalendar
   * @param dateArray
   * @description  get Jobs For Employee By Calendar
   *
   */
    getJobsForEmployeeByCalendar(dateArray: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_GetJobsForEmployeeByCalendar', dateArray, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
    * @function : searchGeographicalData
    * @param searchData
    * @description  Get searchGeographicalData jobs state,catageory,text
    *
    */
    searchGeographicalData(searchData: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.post(this.url + 'app_getJobsByGeographicalSearch', searchData)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
    * @function : updateJobMarkComplete
    * @param dateArray
    * @description   update Job Mark Complete Employee
    *
    */
    updateJobMarkComplete(dateArray: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_updateMarkJobComplete', dateArray, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
    * @function : getMarkJobEmployeeList
    * @param dateArray
    * @description  Mark job Complete  employee list
    *
    */
    getMarkJobEmployeeList(dateArray: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { id: dateArray };
        return this.http.post(this.url + 'app_getMarkJobEmployeeList', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }


    /**    
    * @function : sendMessage
    * @param data
    * @description   Send message message employee/employer
    */
    sendMessage(data: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_sendMessage', data, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**Working
     * @function : getSearchEmployeeJobs
     * @param userId
     * @description  Get All jobs details for emnployee search job section
     *SEARCH JOBS
     */
    getSearchEmployeeJobs(userId: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { user_id: userId };
        return this.http.post(this.url + 'app_getSearchEmployeeJobs', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**
      * Get All employee bids details
      * Employee
      * @param userId
      * MY BIDS
      */
    employeeMyBids(userId: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { user_id: userId };
        return this.http.post(this.url + 'app_getEmployeeMyBidsJobs', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : getMyBidsByCalendar
     * @param dateArray
     * @description  get My bids Details For Employee By Calendar date 
     * MY BIDS
     */
    getMyBidsByCalendar(dateArray: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_GetMyBidsForEmployeeByCalendar', dateArray, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : getMarkJobDetailsForEmployerByID
     * @param markjob_id
     * @description  get markjob complete Details For employer By markjob id to make a payment
     * Payment
     */
    getMarkJobDetailsForEmployerByID(markjob_id: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { markjob_id: markjob_id };
        return this.http.post(this.url + 'app_getMarkJobDetailsForEmployerByID', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : app_getGanratedDetails
     * @param markjob_id
     * @description  genrate hash code and get user details 
     * Payment
     */
    app_getGanratedDetails(markjob_id: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { markjob_id: markjob_id };
        return this.http.post(this.url + 'app_ganratedDetails', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
    * @function : app_paymentTransactionStatus
    * @param txnid
    * @description get payement details by txnid 
    * 
    */
    app_paymentTransactionStatus(txnid: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { txnid: txnid };
        return this.http.post(this.url + 'app_getPaymentTransactionStatus', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : app_setRatingDetails
     * @param txnid
     * @description set rating for employee
     * 
     */
    app_setRatingDetails(ratingData: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_setRatingData', ratingData, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : app_setRatingDetails
     * @param txnid
     * @description set rating for employee
     * 
     */
    app_getRatingInfo(ratingInfo: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_getRatingInfo', ratingInfo, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**Working
     * @function : searchEmployeeJobsFilter
     * @param formData
     * @description  Get All jobs details for emnployee search job section
     * SEARCH JOBS
     */
    searchEmployeeJobsByFilter(formData: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        // let body = { user_id: userId };       
        return this.http.post(this.url + 'app_getSearchEmployeeJobsByFilter', formData, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**
     * @function : searchEmployeeJobsFilter
     * @param formData
     * @description  Get All jobs details for emnployee search job section
     * SEARCH JOBS
     */
    getRegisteredEmployeeUserForMessage(currentJobId: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { jobId: currentJobId };
        return this.http.post(this.url + 'app_getRegisteredEmployeeUserForMessage', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : app_payAmountByCash
     * @param from data
     * @description  genrate hash code and get user details 
     * Payment
     */
    app_payAmountByCash(fromData: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_payAmountByCash', fromData, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : get_UserRatingForCurrentJobDetails
     * @param job_Id,User_id
     * @description  Get User rating for current job details by job_Id,User_id
     */
    app_UserRatingForCurrentJobDetails(job_Id: any, User_id: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { jobId: job_Id, UserId: User_id };
        return this.http.post(this.url + 'app_UserRatingForCurrentJobDetails', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }


    /**    
     * @function : app_checkUserPaymentStatusForCurrentJob
     * @param job_Id,User_id
     * @description  Get User bid details by job_Id,User_id
     */
    app_checkUserPaymentStatusForCurrentJob(job_Id: any, User_id: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { jobId: job_Id, UserId: User_id };
        return this.http.post(this.url + 'app_checkUserPaymentStatusForCurrentJob', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }


    /**    
     * @function : app_checkUserPaymentStatusForCurrentJob
     * @param job_Id,User_id
     * @description  Get User bid details by job_Id,User_id
     */
    app_checkEmployerPaymentStatusForCurrentJob(job_Id: any, User_id: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { jobId: job_Id, UserId: User_id };
        return this.http.post(this.url + 'app_checkEmployerPaymentStatusForCurrentJob', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }


    /**    
     * @function : app_confirmPaymentByEmployee
     * @param formData
     * @description  Get User bid details by job_Id,User_id
     *
     */

    app_confirmPaymentByEmployee(formData: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_confirmPaymentByEmployee', formData, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }


    /**    
     * @function : app_getEmployerTransactionHistory
     * @param employer_Id
     * @description  Get Employer Transaction History details byUser_id
     *
     */

    app_getEmployerTransactionHistory(employer_Id: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { employer_Id: employer_Id };
        return this.http.post(this.url + 'app_getEmployerTransactionHistory', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
    * @function : app_getEmployeeTransactionHistory
    * @param employee_Id
    * @description  Get Employee Transaction History details byUser_id
    *
    */

    app_getEmployeeTransactionHistory(employee_Id: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { employee_Id: employee_Id };
        return this.http.post(this.url + 'app_getEmployeeTransactionHistory', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : app_getAllPaymentOptionsDetails
     * @param NA
     * @description  Get All Payment Options available
     *
     */

    app_getAllPaymentOptionsDetails(flag: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        let body = { flag: flag };
        return this.http.post(this.url + 'app_getAllPaymentOptionsDetails', body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**Working
     * @function : searchEmployerTransactionHistory
     * @param formData
     * @description  Get All transaction History  details for emnployer search job section
     * SEARCH JOBS
     */
    searchEmployerTransactionHistory(formData: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_searchEmployerTransactionHistory', formData, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**Working
     * @function : searchEmployeeTransactionHistory
     * @param formData
     * @description  Get All transaction History  details for emnployee search job section
     * SEARCH JOBS
     */
    searchEmployeeTransactionHistory(formData: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_searchEmployeeTransactionHistory', formData, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    /**    
     * @function : getExpiredJobsByCalendar
     * @param dateArray
     * @description  Get All expired jobs by calender date range
     *
     */
    getExpiredJobsByCalendar(dateArray: any): Observable<Job[]> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_GetExpiredJobsByCalendar', dateArray, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', this.cookieService.get('access_token'));
        headers.append('Accept', 'application/json');
        headers.append('Accept', 'application/pdf');
        headers.append('Content-Type', 'application/json');
    }

    /**
     * @function : cancleLastBid
     * @param formData
     * @description  deletes the last bid performed
     */
    cancleLastBid(formData: any): Observable<any> {

        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url + 'app_deleteLastBid', formData, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'server error'))
    }

}