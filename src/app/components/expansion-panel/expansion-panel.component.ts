import { Component, Input, OnChanges, OnInit } from '@angular/core';

export class ExpansionStates {

  static get Inactive() {
    return 'inactive';
  }

  static get Active() {
    return 'active';
  }

  static get FirstActive() {
    return 'first-active';
  }

}

@Component({
  selector: 'ca-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss']
})
export class ExpansionPanelComponent implements OnInit, OnChanges {

  @Input() expansionState: string;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    console.log('ngOnChanges', changes);
  }

  headerClicked() {
    console.log('headerClicked');
  }

}
