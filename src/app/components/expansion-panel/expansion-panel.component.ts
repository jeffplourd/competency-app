import {
  Component, ElementRef, EventEmitter, Input, OnChanges, Output
} from '@angular/core';

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
export class ExpansionPanelComponent implements OnChanges {
  @Input() expansionState: string;
  @Output() opened = new EventEmitter();

  ngOnChanges(change) {
    const { previousValue, currentValue } = change.expansionState;

    if (previousValue === ExpansionStates.Inactive &&
      (currentValue === ExpansionStates.Active || currentValue === ExpansionStates.FirstActive)) {
      this.opened.emit({});
    }
  }

}
