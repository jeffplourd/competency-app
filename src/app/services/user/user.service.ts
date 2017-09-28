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

  getByEmail(email) {
    return this.apollo
      .query({
          query: gql`
            query getUserByEmail($email: String!) {
              User (email: $email) {
                id
              }
            }
          `,
          variables: {
            email
          }
        })
      .map(({data}) => {
        console.log('data', data);
        return (data as any).User.id;
      });
  }

  getByPhoneNumber(phoneNumber) {
    return this.apollo
      .query({
        query: gql`
          query getUserByPhoneNumber($phoneNumber: String!) {
            User (phoneNumber: $phoneNumber) {
              id
              displayName
            }
          }
        `,
        variables: {
          phoneNumber
        }
      })
    .map(({data}) => {
      return data && (data as any).User;
    });
  }

  createAnon() {
    return this.apollo.mutate({
      mutation: gql`
        mutation authenticateAnonymousUser($secret: String!) {
          authenticateAnonymousUser(
            secret: $secret
          ) {
            id
          }
        }
      `,
      variables: {
        secret: 'supersecret'
      }
    });
  }

  updatePhoneNumber(id, phoneNumber) {
    return this.apollo.mutate({
      mutation: gql`
        mutation updateUserPhoneNumber($id: ID!, $phoneNumber: String!) {
          updateUser(
            id: $id,
            phoneNumber: $phoneNumber
          ) {
            id
            phoneNumber
          }
        }
      `,
      variables: {
        id,
        phoneNumber
      }
    });
  }

}
