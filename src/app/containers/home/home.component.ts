import { Component, OnInit } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/Observable';
import { EvaluationRequestService } from '../../services/evaluation-request/evaluation-request.service';
import { CompetencyService } from '../../services/competency/competency.service';
import { MdDialog } from '@angular/material';
import { CreateCompetencyDialogComponent } from '../../components/create-competency-dialog/create-competency-dialog.component';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';
import { ExpansionStates } from '../../components/expansion-panel/expansion-panel.component';
import { CreateRequestDialogComponent } from '../../components/create-request-dialog/create-request-dialog.component';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';

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
          description
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
  activeElementId: string;

  constructor(
    private apollo: Apollo,
    private evaluationRequestService: EvaluationRequestService,
    private competencyService: CompetencyService,
    private dialog: MdDialog,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    console.log('this.authService.authData', this.authService.authData);
    this.data = this.apollo
      .watchQuery({
        query,
        variables: {
          email: this.authService.authData.email
        }
      });

    this.data.subscribe((data) => {
      console.log('watchQuery', data);
    });

    this.currentUser = this.data.map(({data}) => data.User);
    this.currentUserCompetencies = this.currentUser.map((user) => user.competencies).filter((value) => !!value);
    this.currentUserRequests = this.currentUser.map((user) => user.evaluationRequestsFromOther).filter((value) => !!value);

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
    this.dialog
      .open(
        CreateCompetencyDialogComponent,
        { width: '600px' }
      )
      .afterClosed()
      .filter((result) => !!result)
      .withLatestFrom(this.currentUser)
      .map((data) => {
        return {
          title: data[0].title,
          description: data[0].description,
          user: data[1]
        };
      })
      .mergeMap(({title, description, user}) => {
        return this.competencyService.create(title, description, user.id);
      })
      .subscribe((data) => {
        console.log('created competency', data);
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

  toggleExpand(elementId) {
    console.log('toggleExpand', elementId);
    if (elementId === this.activeElementId) {
      this.activeElementId = undefined;
    }
    else {
      this.activeElementId = elementId;
    }
  }

  isActiveState(id, index): string {
    const isActive = id === this.activeElementId;

    if (!isActive) {
      return ExpansionStates.Inactive;
    }
    else if (index === 0) {
      return ExpansionStates.FirstActive;
    }
    else {
      return ExpansionStates.Active;
    }
  }

  handleCommentSubmitted(event) {
    console.log('handleCommentSubmitted', event);
    this.competencyService
      .createComment(event.competencyId, event.text)
      .subscribe((result) => {
        console.log('added comment', result);
      });
  }

  handleHeaderClicked(elementId) {
    console.log('handleHeaderClicked', elementId);
    if (elementId === this.activeElementId) {
      this.activeElementId = undefined;
    }
    else {
      this.activeElementId = elementId;
    }
  }

  handlePrimaryActionClicked(event) {
    console.log('handlePrimaryActionClicked', event);
    event.cancelBubble = true;
  }

  createRequestDialog(event, competency) {
    event.cancelBubble = true;

    this.dialog
      .open(CreateRequestDialogComponent, {
        width: '600px',
        disableClose: true
      })
      .afterClosed()
      .filter((result) => !!result)
      .mergeMap(({email, message}) => {
        return this.userService.getByEmail(email).map((evaluatorId) => {
          return {
            evaluatorId,
            message
          };
        });
      })
      .mergeMap(({evaluatorId, message}) => {
        console.log('result', evaluatorId, message);
        return this.evaluationRequestService.create(
          competency.id,
          this.authService.authData.userId,
          evaluatorId,
          message
        );
      })
      .subscribe((result) => {
        console.log('createRequestDialog', result);
      });
  }

  sendComment() {
    console.log('sendComment');
  }

  signOut() {
    this.authService.signOut();
  }
}
