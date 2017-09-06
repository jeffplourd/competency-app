import { Component, OnInit } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/Observable';
import { EvaluationRequestService } from '../../services/evaluation-request/evaluation-request.service';
import { UserService } from '../../services/user/user.service';
import { CompetencyService } from '../../services/competency/competency.service';

const query = gql`
  query getUserByEmail($email: String!) {
    User (email: $email) {
      id
      displayName
      competencies {
        id
        title
        description
        comments {
          id
          text
        }
      }
      evaluationRequestsFromOther {
        id
        message
        evaluatee {
          email
        }
        evaluator {
          email
        }
        competency {
          id
          title
          comments {
            text
          }
        }
      }
    }
  }
`;

@Component({
  selector: 'ca-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  data: ApolloQueryObservable<any>;
  currentUser: Observable<any>;
  currentUserCompetencies: Observable<any>;
  currentUserRequests: Observable<any>;

  constructor(
    private apollo: Apollo,
    private evaluationRequestService: EvaluationRequestService,
    private userService: UserService,
    private competencyService: CompetencyService
  ) { }

  ngOnInit() {
    this.data = this.apollo
      .watchQuery({
        query,
        variables: {
          email: 'jeff@classkick.com'
        }
      });

    this.data.subscribe((data) => {
      console.log('watchQuery', data);
    });

    this.currentUser = this.data.map(({data}) => data.User);
    this.currentUserCompetencies = this.currentUser.map((user) => user.competencies);
    this.currentUserRequests = this.currentUser.map((user) => user.evaluationRequestsFromOther);

    this.evaluationRequestService.createSubscription().subscribe((data) => {
      console.log('evaluation subscription', data);
      this.data.refetch().then((result) => {
        console.log('refetch success', result);
      });
    });

    this.competencyService.createSubscription().subscribe((data) => {
      console.log('competency subscription', data);
      this.data.refetch().then((result) => {
        console.log('refetch success', result);
      });
    });
  }

  createCompetency() {
    this.competencyService
      .create(
        'test-title',
        'test-description',
        'cj77nguwx0kjt011650c5671i'
      )
      .subscribe((data) => {
        console.log('competency created: ', data);
      });
  }

  createEvaluationRequest() {
    this.evaluationRequestService
      .create(
        'cj7912z2uatv00120705bv66n',
        'cj77nguwx0kjt011650c5671i',
        'cj77n324i0iho0116v6obn7ej',
        'Please give me feedback on my test-competency'
      )
      .subscribe((data) => {
        console.log('evaluation request created: ', data);
      });
  }
}
