import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ca-competency-comment',
  templateUrl: './competency-comment.component.html',
  styleUrls: ['./competency-comment.component.scss']
})
export class CompetencyCommentComponent implements OnInit {

  @Input() comment;
  @Input() expanded = true;

  constructor() { }

  ngOnInit() {
  }

  get classes() {
    return {
      'expanded': this.expanded
    };
  }

  get fromDisplayName() {
    return this.comment && this.comment.from && this.comment.from.displayName;
  }


  get fromDisplayNameFirstLetter() {
    return this.fromDisplayName && this.fromDisplayName.slice(0, 1);
  }

}
