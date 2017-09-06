import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './containers/signin/signin.component';
import { SignupComponent } from './containers/signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule, MdExpansionModule, MdInputModule, MdListModule, MdRippleModule,
  MdToolbarModule
} from '@angular/material';
import { HomeComponent } from './containers/home/home.component';
import { ApolloModule } from 'apollo-angular';
import { provideClient } from './apollo';
import { EvaluationRequestService } from './services/evaluation-request/evaluation-request.service';
import { UserService } from './services/user/user.service';
import { CompetencyService } from './services/competency/competency.service';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MdExpansionModule,
    MdListModule,
    MdInputModule,
    MdButtonModule,
    MdToolbarModule,
    MdRippleModule,
    ApolloModule.forRoot(provideClient)
  ],
  providers: [
    UserService,
    CompetencyService,
    EvaluationRequestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
