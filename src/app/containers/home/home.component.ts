import { Component, OnInit } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/Observable';
import { EvaluationRequestService } from '../../services/evaluation-request/evaluation-request.service';
import { UserService } from '../../services/user/user.service';
import { CompetencyService } from '../../services/competency/competency.service';
import { MdDialog } from '@angular/material';
import { CreateCompetencyDialogComponent } from '../../components/create-competency-dialog/create-competency-dialog.component';
import { combineLatest } from 'rxjs/observable/combineLatest';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';
import { expansionAnimation, ExpansionStates } from '../../components/expansion-animation/expansion-animation';
import { ExpansionListItemComponentConfig } from '../../components/expansion-list-item/expansion-list-item.component';

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
  styleUrls: ['./home.component.scss'],
  animations: [expansionAnimation]
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
    private userService: UserService,
    private competencyService: CompetencyService,
    private dialog: MdDialog
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

  requestFeedback(event) {
    console.log('requestFeedback', event);
    event.cancelBubble = true;
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

  requestListItemConfig(request, index): ExpansionListItemComponentConfig {
    return {
      id: request.id,
      isFirst: index === 0,
      title: request.competency.title,
      description: request.competency.description,
      comments: request.competency.comments
    };
  }

  handleCommentSubmitted(comment) {
    console.log('handleCommentSubmitted', comment);
  }

  handleHeaderClicked(event) {
    console.log('handleHeaderClicked', event.elementId);
    if (event.elementId === this.activeElementId) {
      this.activeElementId = undefined;
    }
    else {
      this.activeElementId = event.elementId;
    }
  }

  handlePrimaryActionClicked(event) {
    console.log('handlePrimaryActionClicked', event);
  }

}
