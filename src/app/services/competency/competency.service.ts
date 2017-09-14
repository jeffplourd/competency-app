import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

@Injectable()
export class CompetencyService {

  constructor(private apollo: Apollo) { }

  create(title, description, userId) {
    const mutation = gql`
    mutation createCompetency($title: String!, $description: String!, $userId: ID!) {
      createCompetency (
        title: $title,
        description: $description,
        userId: $userId
      ) {
        id
        title
        description
        user {
          id
          displayName
          email
        }
      }
    }
    `;
    return this.apollo.mutate({
      mutation,
      variables: {
        title,
        description,
        userId
      }
    });
  }

  createSubscription() {
    return this.apollo.subscribe({
      query: gql`
        subscription newCompetencies {
          Competency(filter: {
            mutation_in: [CREATED]
          }) {
            mutation
            node {
              id
              title
              description
            }
          }
        }
      `
    });
  }

  createComment(competencyId, text) {
    return this.apollo.mutate({
      mutation: gql`
        mutation createComment($competencyId: ID!, $text: String) {
          createComment(
            competencyId: $competencyId
            text: $text
          ) {
            id
            text
            competency {
              title
            }
          }
        }
      `,
      variables: {
        competencyId,
        text
      }
    });
  }

  createCommentSubscription() {
    return this.apollo.subscribe({
      query: gql`
        subscription newComments {
          Comment(filter: {
            mutation_in: [CREATED]
          }) {
            mutation
            node {
              id
              text
            }
          }
        }
      `
    });
  }

}
