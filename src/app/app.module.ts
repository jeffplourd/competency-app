import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './containers/signin/signin.component';
import { SignupComponent } from './containers/signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule, MdDialogModule, MdExpansionModule, MdInputModule, MdListModule, MdRippleModule,
  MdToolbarModule
} from '@angular/material';
import { HomeComponent } from './containers/home/home.component';
import { ApolloModule } from 'apollo-angular';
import { provideClient } from './apollo';
import { EvaluationRequestService } from './services/evaluation-request/evaluation-request.service';
import { UserService } from './services/user/user.service';
import { CompetencyService } from './services/competency/competency.service';
import { CreateCompetencyDialogComponent } from './components/create-competency-dialog/create-competency-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    HomeComponent,
    CreateCompetencyDialogComponent
  ],
  entryComponents: [
    CreateCompetencyDialogComponent
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
    MdDialogModule,
    ApolloModule.forRoot(provideClient),
    ReactiveFormsModule
  ],
  providers: [
    UserService,
    CompetencyService,
    EvaluationRequestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
