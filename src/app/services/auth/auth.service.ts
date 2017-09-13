
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import jwtDecode from 'jwt-decode';

class UserTokenInfo {

  constructor(
    public userId: string,
    public email: string
  ) {}

}

@Injectable()
export class AuthService {

  _authData;

  constructor(public apollo: Apollo, public router: Router) {}

  signUp(email, password, displayName) {
    return this.signUpUser(email, password, displayName)
      .mergeMap(() => {
        return this.signInUser(email, password);
      });
  }

  signIn(email, password) {
    return this.signInUser(email, password);
  }

  private signInUser(email, password) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($email: String!, $password: String!) {
          signinUser(email: {email: $email, password: $password}) {
            token
          }
        }
      `,
      variables: {
        email,
        password
      }
    })
    .map((result: any) => {
      const token = result.data.signinUser.token;
      localStorage.setItem('graphcool_token', token);
      return token;
    });
  }

  signOut() {
    this.reset();
    this.router.navigate(['signin']);
  }

  reset() {
    localStorage.removeItem('graphcool_token');
    this._authData = undefined;
  }

  private signUpUser(email, password, displayName) {
    return this.apollo.mutate({
      mutation: gql`
        mutation createUser($email: String!, $password: String!, $displayName: String!) {
          createUser(
            authProvider: {
              email: {
                email: $email,
                password: $password
              }
            },
            displayName: $displayName
          ) {
            id
            displayName
            email
          }
        }
      `,
      variables: {
        email,
        password,
        displayName
      }
    });
  }

  get token() {
    return localStorage.getItem('graphcool_token');
  }

  get authData() {
    if (!this._authData) {
      const extracted = jwtDecode(this.token);
      this._authData = new UserTokenInfo(extracted.userId, extracted.authData.email);
    }
    return this._authData;
  }

}
