import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class EvaluationRequestService {

  constructor(
    private apollo: Apollo,
    private http: HttpClient
  ) { }

  create(competencyId, evaluateeId, evaluatorId, comments) {
    return this.apollo.mutate({
      mutation: gql`
        mutation createEvaluationRequest(
        $competencyId: ID!
        $evaluateeId: ID!
        $evaluatorId: ID!
        $comments: [EvaluationRequestcommentsComment!]
        ) {
          createEvaluationRequest(
            competencyId: $competencyId,
            evaluateeId: $evaluateeId,
            evaluatorId: $evaluatorId,
            comments: $comments
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
        comments,
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

  view(requestId) {
    return this.apollo.mutate({
      mutation: gql`
        mutation viewEvaluationRequest($requestId: ID!, $viewedAt: DateTime) {
          updateEvaluationRequest(
            id: $requestId,
            viewedAt: $viewedAt
          ) {
            id
          }
        }
      `,
      variables: {
        requestId,
        viewedAt: new Date().toISOString()
      }
    });
  }

  createRequest(competencyId, evaluateeId, evaluatorId, message) {
    return this.http.post(
      `${environment.firebase.functionsUrl}/evaluation-request`,
      { competencyId, evaluateeId, evaluatorId, message }
    );
  }


}
