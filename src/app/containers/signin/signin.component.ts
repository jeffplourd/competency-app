import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'ca-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {

  signinForm: FormGroup;
  error: Error;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, public router: Router) {
    this.createSignupForm();
  }

  createSignupForm() {
    this.signinForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const {email, password} = this.signinForm.value;
    this.authService.signIn(email, password)
      .subscribe((result) => {
        console.log('loged in user', result);
        this.router.navigate(['home']);
      }, (error) => {
        console.log('error: ', error);
        this.error = error;
      });
  }


}
