import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class EvaluationRequestService {

  constructor(private apollo: Apollo) { }

  create(competencyId, evaluateeId, evaluatorId, message) {
    return this.apollo.mutate({
      mutation: gql`
        mutation createEvaluationRequest(
        $competencyId: ID!
        $evaluateeId: ID!
        $evaluatorId: ID!
        $message: String!
        ) {
          createEvaluationRequest(
            competencyId: $competencyId,
            evaluateeId: $evaluateeId,
            evaluatorId: $evaluatorId,
            message: $message
          ) {
            id
            competency {
              title
            }
            evaluatee {
              email
            }
            evaluator {
              email
            }
          }
        }
      `,
      variables: {
        competencyId,
        evaluateeId,
        evaluatorId,
        message,
      }
    });
  }

  createSubscription() {
    const query = gql`
      subscription newEvaluationRequests {
        EvaluationRequest(filter: {
          mutation_in: [CREATED]
        }) {
          mutation
          node {
            id
            evaluatee {
              id
              email
            }
            evaluator {
              id
              email
            }
            competency {
              id
              title
            }
          }
        }
      }
    `;
    return this.apollo.subscribe({
      query
    });
  }

  close(requestId) {
    return this.apollo.mutate({
      mutation: gql`
        mutation closeEvaluationRequest($requestId: ID!, $closedAt: DateTime) {
          updateEvaluationRequest(
            id: $requestId, 
            closedAt: $closedAt
          ) {
            id
          }
        }
      `,
      variables: {
        requestId,
        closedAt: new Date().toISOString()
      }
    });
  }

  complete(requestId) {
    return this.apollo.mutate({
      mutation: gql`
        mutation completeEvaluationRequest($requestId: ID!, $completedAt: DateTime) {
          updateEvaluationRequest(
            id: $requestId,
            completedAt: $completedAt
          ) {
            id
          }
        }
      `,
      variables: {
        requestId,
        completedAt: new Date().toISOString()
      }
    });
  }


}
