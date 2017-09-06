import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';



@Injectable()
export class UserService {

  constructor(private apollo: Apollo) { }

  create(displayName, competenciesIds, email) {
    return this.apollo.mutate({
      mutation: gql`
        mutation createUser($competenciesIds: [ID!]!, $displayName: String!, $email: String!) {
          createUser(
            competenciesIds: $competenciesIds,
            displayName: $displayName,
            email: $email
          ) {
            id
            displayName
            email
          }
        }
      `,
      variables: {
        'displayName': 'Jeff Plourd',
        'competenciesIds': [],
        'email': 'test@compapp.com'
      }
    });


  }

}
