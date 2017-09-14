import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './containers/signin/signin.component';
import { SignupComponent } from './containers/signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule, MdCardModule, MdDialogModule, MdExpansionModule, MdInputModule, MdListModule, MdRippleModule,
  MdToolbarModule
} from '@angular/material';
import { HomeComponent } from './containers/home/home.component';
import { ApolloModule } from 'apollo-angular';
import { provideClient } from './apollo';
import { EvaluationRequestService } from './services/evaluation-request/evaluation-request.service';
import { UserService } from './services/user/user.service';
import { CompetencyService } from './services/competency/competency.service';
import { CreateCompetencyDialogComponent } from './components/create-competency-dialog/create-competency-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Autosize } from '../../node_modules/angular2-autosize/angular2-autosize';
import { ExpansionPanelComponent } from './components/expansion-panel/expansion-panel.component';
import { CreateRequestDialogComponent } from './components/create-request-dialog/create-request-dialog.component';
import { AuthService } from './services/auth/auth.service';
import { CompetencyCardComponent } from './components/competency-card/competency-card.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    HomeComponent,
    CreateCompetencyDialogComponent,
    Autosize,
    ExpansionPanelComponent,
    CreateRequestDialogComponent,
    CompetencyCardComponent
  ],
  entryComponents: [
    CreateCompetencyDialogComponent,
    CreateRequestDialogComponent
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
    MdCardModule,
    ApolloModule.forRoot(provideClient),
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    UserService,
    CompetencyService,
    EvaluationRequestService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
