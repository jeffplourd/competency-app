import { Component, Input } from '@angular/core';

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
export class ExpansionPanelComponent {
  @Input() expansionState: string;
}
