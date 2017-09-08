import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { expansionAnimation, ExpansionStates } from '../expansion-animation/expansion-animation';

export interface ExpansionListItemComponentConfig {
  id: string;
  title: string;
  description: string;
  comments: any;
  isFirst: boolean;
}

@Component({
  selector: 'ca-expansion-list-item',
  templateUrl: './expansion-list-item.component.html',
  styleUrls: ['./expansion-list-item.component.scss'],
  animations: [expansionAnimation]
})
export class ExpansionListItemComponent implements OnInit, OnChanges {

  @Input() expansionState: string;
  @Input() config: ExpansionListItemComponentConfig;

  @Output() onCommentSubmitted = new EventEmitter<any>();
  @Output() onHeaderClicked = new EventEmitter<any>();
  @Output() onPrimaryActionClicked = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log('ExpansionListItemComponent');
  }

  ngOnChanges(changes) {
    console.log('ngOnChanges', this.config);
  }

  submitComment(comment) {
    this.onCommentSubmitted.emit(comment);
  }

  headerClicked(event) {
    this.onHeaderClicked.emit({
      event,
      elementId: this.config.id
    });
  }

  primaryActionClicked(event) {
    event.cancelBubble = true;
    this.onPrimaryActionClicked.emit(event);
  }

  get isActive() {
    return this.expansionState === ExpansionStates.Active || this.expansionState === ExpansionStates.FirstActive;
  }
}
