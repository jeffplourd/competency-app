import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'ca-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  signupForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, public router: Router) {
    this.createSignupForm();
  }

  createSignupForm() {
    this.signupForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
      displayName: ['', Validators.required]
    });
  }

  onSubmit() {
    const {email, password, displayName} = this.signupForm.value;
    this.authService.signUp(email, password, displayName)
      .subscribe((result) => {
        console.log('created user', result);
        this.router.navigate(['home']);
      });
  }


}
