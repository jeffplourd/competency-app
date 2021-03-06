import {
  Component, OnInit, ViewChildren
} from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/Observable';
import { EvaluationRequestService } from '../../services/evaluation-request/evaluation-request.service';
import { CompetencyService } from '../../services/competency/competency.service';
import { MdDialog } from '@angular/material';
import { CreateCompetencyDialogComponent } from '../../components/create-competency-dialog/create-competency-dialog.component';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/debounceTime';
import { ExpansionStates } from '../../components/expansion-panel/expansion-panel.component';
import { CreateRequestDialogComponent } from '../../components/create-request-dialog/create-request-dialog.component';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import * as moment from 'moment';
import { StickyTemplateComponent } from '../../components/sticky-template/sticky-template.component';
import { WindowService } from '../../services/window/window.service';
import { Router } from '@angular/router';

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
          from {
            id
            displayName
          }
        }
      }
      evaluationRequestsFromOther {
        id
        message
        completedAt
        viewedAt
        closedAt
        comments {
          id
          text
          from {
            id
            displayName
          }
        }
        evaluatee {
          id
          email
          displayName
        }
        evaluator {
          id
          email
          displayName
        }
        competency {
          id
          title
          description
        }
      }
      evaluationRequestsForMe {
        id
        message
        completedAt
        viewedAt
        closedAt
        comments {
          id
          text
          from {
            id
            displayName
          }
        }
        evaluatee {
          id
          email
          displayName
        }
        evaluator {
          id
          email
        }
        competency {
          id
          title
          description
          comments {
            id
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
  displayName: Observable<string>;
  currentUserCompetencies: Observable<any>;
  hasCompetencies: Observable<boolean>;

  uncompletedRequestsFromOthers: Observable<any>;
  hasUncompletedRequestsFromOthers: Observable<boolean>;
  completedRequestsFromOthers: Observable<any>;
  hasCompletedRequestsFromOthers: Observable<boolean>;

  completedRequestsForMe: Observable<any>;
  hasCompletedRequestsForMe: Observable<boolean>;
  uncompletedRequestsForMe: Observable<any>;
  hasUncompletedRequestsForMe: Observable<boolean>;

  activeElementId: string;
  feedbackMessage: string;
  reflectionText: string;
  showStickyHeader: boolean;
  showStickyFooter: boolean;

  @ViewChildren(StickyTemplateComponent) stickyTemplates: any;

  openRequestDialog = CreateRequestDialogComponent.open;

  constructor(
    private apollo: Apollo,
    private evaluationRequestService: EvaluationRequestService,
    private competencyService: CompetencyService,
    private dialog: MdDialog,
    private authService: AuthService,
    private userService: UserService,
    private windowService: WindowService,
    private router: Router
  ) { }

  ngOnInit() {

    if (!this.authService.isAuthenticated) {
      this.router.navigate(['signin']);
    }

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
    this.displayName = this.currentUser.map((user) => user.displayName);

    this.currentUserCompetencies = this.currentUser.map((user) => user.competencies).filter((value) => !!value);
    this.hasCompetencies = this.currentUserCompetencies.map((competencies) => competencies.length > 0);

    /*** From Others ***/
    this.uncompletedRequestsFromOthers = this.currentUser.map((user) => {
      return user.evaluationRequestsFromOther.filter((request) => !request.completedAt);
    });
    this.hasUncompletedRequestsFromOthers = this.uncompletedRequestsFromOthers.map((requests) => requests.length > 0);

    this.completedRequestsFromOthers = this.currentUser
      .map((user) => {
        return user.evaluationRequestsFromOther.filter((request) => {
          return !!request.completedAt && !request.closedAt;
        });
      });
    this.hasCompletedRequestsFromOthers = this.completedRequestsFromOthers.map((requests) => requests.length > 0);


    /*** For Me ***/
    this.completedRequestsForMe = this.currentUser
      .map((user) => {
        return user.evaluationRequestsForMe.filter(({completedAt, viewedAt}) => {
          if (!completedAt) {
            return false;
          }
          return !viewedAt || (viewedAt && (moment().diff(moment(viewedAt), 'm') < 5));
        });
      });
    this.hasCompletedRequestsForMe = this.completedRequestsForMe.map((requests) => requests.length > 0);

    this.uncompletedRequestsForMe = this.currentUser.map((user) => {
      return user.evaluationRequestsForMe.filter(({completedAt}) => !completedAt);
    });
    this.hasUncompletedRequestsForMe = this.uncompletedRequestsForMe.map((requests) => requests.length > 0);

    this.evaluationRequestService.createSubscription()
      .merge(
        this.competencyService.createSubscription(),
        this.competencyService.createCommentSubscription()
      )
      .debounceTime(500)
      .subscribe((data) => {
        console.log('Subscription: ', data);
        this.refetch();
      });
  }

  refetch() {
    this.data.refetch().then((result) => {
      console.log('refetch success', result);
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

  handleHeaderClicked(elementId) {
    if (elementId === this.activeElementId) {
      this.activeElementId = undefined;
    }
    else {
      this.activeElementId = elementId;
      setTimeout(() => {
        this.setShouldElementShowStickyHeader();
        this.setShouldElementShowStickyFooter();
      }, 350);
    }
  }

  createRequestDialog(event, competency) {
    event.cancelBubble = true;

    this.openRequestDialog(this.dialog)
      .afterClosed()
      .filter((result) => !!result)
      .mergeMap(({evaluatorId, message}) => {
        return this.evaluationRequestService.createRequest(
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

  submitFeedback(competencyId, feedbackMessage, requestId) {
    return this.sendFeedbackComment(competencyId, feedbackMessage, this.authService.authData.userId, requestId)
      .mergeMap(() => {
        return this.evaluationRequestService.complete(requestId);
      })
      .subscribe((result) => {
        console.log('result', result);
      });
  }

  sendFeedbackComment(competencyId, feedbackMessage, fromId, evaluationRequestId) {
    this.feedbackMessage = '';
    return this.competencyService.createComment(competencyId, feedbackMessage, fromId, evaluationRequestId);
  }

  sendReflectionComment(competencyId, reflectionText) {
    this.reflectionText = '';
    return this.competencyService.createComment(competencyId, reflectionText, this.authService.authData.userId, null)
      .subscribe((data) => {
        console.log('sent reflection comment: ', data);
      });
  }

  signOut() {
    this.authService.signOut();
  }

  markRequestViewed(request) {
    console.log('markRequestViewed', request);

    if (!request.viewedAt) {
      this.evaluationRequestService.view(request.id).subscribe(() => {
        console.log('mark viewed');
      });
    }
  }

  onScroll(event) {
    this.setShouldElementShowStickyHeader();
    this.setShouldElementShowStickyFooter();
  }

  shouldElementShowStickyHeader(id) {
    return id === this.activeElementId && this.showStickyHeader;
  }

  setShouldElementShowStickyHeader() {
    const activeTemplate = this.stickyTemplates.find((temp) => temp.id === this.activeElementId && !!temp.top);
    const elementRef = activeTemplate && activeTemplate.elementRef;
    const boundingClientRect = elementRef && elementRef.nativeElement.getBoundingClientRect();
    this.showStickyHeader = boundingClientRect && boundingClientRect.top <= 64;
  }

  shouldElementShowStickyFooter(id) {
    return this.activeElementId === id && this.showStickyFooter;
  }

  setShouldElementShowStickyFooter() {
    const activeTemplate = this.stickyTemplates.find((temp) => temp.id === this.activeElementId && !!temp.bottom);
    const elementRef = activeTemplate && activeTemplate.elementRef;
    const boundingRect = elementRef && elementRef.nativeElement.getBoundingClientRect();
    this.showStickyFooter = boundingRect && boundingRect.bottom >= this.windowService.nativeWindow.innerHeight;
  }

  deleteCompetency(competencyId) {
    // should probably also mark related requests as closed
    this.competencyService.deleteCompetency(competencyId).subscribe(() => {
      console.log('deleted competency: ', competencyId);
    });
  }

  createAnonUser() {
    this.userService.createAnon()
      .mergeMap(({data}) => {
        const authenticateAnonymousUser = (data as any).authenticateAnonymousUser;
        return this.userService.updatePhoneNumber(authenticateAnonymousUser.id, '8587778888');
      })
      .subscribe((result) => {
        console.log('createAnon', result);
      });
  }
}
