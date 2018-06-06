import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './components/auth/auth.guard';
export const router: Routes = [
    {
        path: '',
        loadChildren: 'app/components/home/home.module#HomeModule'
    },
    {
        path: 'editProfile',
        loadChildren: 'app/components/editProfile/editProfile.module#EditProfileModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'changePassword',
        loadChildren: 'app/components/changePassword/changePassword.module#ChangePasswordModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'logout',
        loadChildren: 'app/components/logout/logout.module#LogoutModule'
    },
    {
        path: 'resetPassword',
        loadChildren: 'app/components/resetPassword/resetPassword.module#ResetPasswordModule'
    },
    {
        path: 'userActivation',
        loadChildren: 'app/components/userActivation/userActivation.module#UserActivationModule'
    },
    {
        path: 'postjob',
        loadChildren: 'app/components/postjob/postjob.module#PostjobModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'openJob',
        loadChildren: 'app/components/openJob/openJob.module#OpenJobModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'expiredJob',
        loadChildren: 'app/components/expiredJob/expiredJob.module#ExpiredJobModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'bookedJob',
        loadChildren: 'app/components/bookedJob/bookedJob.module#BookedJobModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'viewJob/:jobId',
        loadChildren: 'app/components/viewJob/viewJob.module#ViewJobModule',
        canActivate: [AuthGuard]
    },
    {
        //if user hit without param or id
        path: 'viewJob',
        loadChildren: 'app/components/viewJob/viewJob.module#ViewJobModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'employeeEdit',
        loadChildren: 'app/components/employeeEdit/employeeEdit.module#EmployeeEditModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'editJob/:jobId',
        loadChildren: 'app/components/editJob/editJob.module#EditJobModule',
        canActivate: [AuthGuard]
    },
    {
        //if user hit without param or id
        path: 'editJob',
        loadChildren: 'app/components/editJob/editJob.module#EditJobModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'viewEmp/:empId',
        loadChildren: 'app/components/viewEmp/viewEmp.module#ViewEmpModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'company',
        loadChildren: 'app/components/company/company.module#CompanyModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'employeeMyJobs',
        loadChildren: 'app/components/employeeMyJobs/employeeMyJobs.module#EmployeeMyJobsModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'viewEmployeeJob/:job_Id',
        loadChildren: 'app/components/viewEmployeeJob/viewEmployeeJob.module#ViewEmployeeJobModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'notification',
        loadChildren: 'app/components/notification/notification.module#NotificationModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'jobByCategory/:jobCategoryId',
        loadChildren: 'app/components/jobByCategory/jobByCategory.module#JobByCategoryModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'viewJobDetails/:job_Id',
        loadChildren: 'app/components/viewJobDetails/viewJobDetails.module#ViewJobDetailsModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'geographicalSearch',
        loadChildren: 'app/components/geographicalSearch/geographicalSearch.module#GeographicalSearchModule',
        // canActivate: [AuthGuard]
    },
    {
        path: 'searchEmployeeJobs',
        loadChildren: 'app/components/searchEmployeeJobs/searchEmployeeJobs.module#SearchEmployeeJobsModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'myBids',
        loadChildren: 'app/components/myBids/myBids.module#MyBidsModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'makePayment/:markJob_id',
        loadChildren: 'app/components/makePayment/makePayment.module#MakePaymentModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'paymentStatus/:txnid',
        loadChildren: 'app/components/paymentStatus/paymentStatus.module#PaymentStatusModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'employerTransactions',
        loadChildren: 'app/components/employerTransactions/employerTransactions.module#EmployerTransactionsModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'employeeTransactions',
        loadChildren: 'app/components/employeeTransactions/employeeTransactions.module#EmployeeTransactionsModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'about',
        loadChildren: 'app/components/about/about.module#AboutModule'
    },
    {
        path: 'contactUs',
        loadChildren: 'app/components/contactUs/contactUs.module#ContactUsModule'
    },
    {
        path: 'hireWorkers',
        loadChildren: 'app/components/hireWorkers/hireWorkers.module#HireWorkersModule'
    },
    {
        path: 'howitworks',
        loadChildren: 'app/components/howitworks/howitworks.module#HowItWorksModule'
    },
    {
        path: 'termsCondition',
        loadChildren: 'app/components/termsCondition/termsCondition.module#TermsConditionModule'
    },
    {
        path: 'privacy',
        loadChildren: 'app/components/privacy/privacy.module#PrivacyPoliciesModule'
    },
    {
        path: 'newJobContent',
        loadChildren: 'app/components/newJobContent/newJobContent.module#NewJobContentModule'
    },
    {
        path: 'faq',
        loadChildren: 'app/components/faq/faq.module#FaqModule'
    }


    /* {
       path: 'gallery',
       loadChildren: 'app/components/gallery/gallery.module#GalleryModule'
   },
   {
       path: 'about',
       loadChildren: 'app/components/about/about.module#AboutModule'
   },*/

];

export const appRouter: ModuleWithProviders = RouterModule.forRoot(router);