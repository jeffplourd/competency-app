import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';



@Injectable()
export class UserService {

  constructor(private apollo: Apollo) { }

  create(email, password, displayName, competenciesIds) {
    return this.apollo.mutate({
      mutation: gql`
        mutation createUser($email: String!, $password: String!, $displayName: String!, $competenciesIds: [ID!]!) {
          createUser(
            authProvider: {
              email: {
                email: $email,
                password: $password
              }
            },
            displayName: $displayName,
            competenciesIds: $competenciesIds
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
        displayName,
        competenciesIds
      }
    });
  }

}
