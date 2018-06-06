import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ClickOutsideModule } from 'ng-click-outside';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { appRouter } from './app.router';
import { OwlModule } from 'ng2-owl-carousel';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgotPassword/forgotPassword.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SpinnerService } from './components/spinner/spinner.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from './components/auth/auth.guard';
import { Shared } from './components/services/shared.service';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { TimePickerModule } from "ng2-simple-timepicker";
import { ShareButtonsModule } from '@ngx-share/buttons';
import { TmonDatePickerComponent } from 'ng2-tmon-date-time-picker/ng2-tmon-date-time-picker';
import { otpVerificationService } from './components/otpVerification/otpVerification.service';
import { OtpVerificationComponent } from "./components/otpVerification/otpVerification.component";
import { TmonTimePickerComponent } from 'ng2-tmon-date-time-picker/ng2-tmon-date-time-picker';
import { AdsenseModule } from 'ng2-adsense';
import { MessagingService } from "./components/messaging/messaging.service";
import { AngularFireModule } from 'angularfire2'; // for AngularFireDatabase 
import { AngularFireDatabaseModule } from 'angularfire2/database'; // for AngularFireAuth 
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { Meta } from '@angular/platform-browser';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        HeaderComponent,
        FooterComponent,
        RegisterComponent,
        LoginComponent,
        ForgotPasswordComponent,
        SpinnerComponent,
        TmonDatePickerComponent,
        OtpVerificationComponent,
        TmonTimePickerComponent
    ],
    imports: [
        NgbModule.forRoot(),
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        appRouter,
        OwlModule,
        CommonModule,
        BrowserAnimationsModule,
        ClickOutsideModule,
        MyDateRangePickerModule,
        HttpModule,
        HttpClientModule,
        HttpClientJsonpModule,
        ShareButtonsModule.forRoot(),
        AngularFireModule.initializeApp({
            apiKey: "AIzaSyAD9a2JZoLTzMreQaVuXknm3vR1YRSQDVQ",
            authDomain: "motipotli-d61fe.firebaseapp.com",
            databaseURL: "https://motipotli-d61fe.firebaseio.com",
            projectId: "motipotli-d61fe",
            storageBucket: "motipotli-d61fe.appspot.com",
            messagingSenderId: "14691279328"
        }),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AdsenseModule.forRoot({
            adClient: 'ca-pub-2201288336602886',
            adSlot: 6270830582,
        }),
    ],
    providers: [SpinnerService, CookieService, AuthGuard, Shared, otpVerificationService, MessagingService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
