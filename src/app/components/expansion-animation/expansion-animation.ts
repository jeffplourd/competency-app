import { animate, state, style, transition, trigger } from '@angular/animations';

const inactiveStyles = {
  height: '48px'
};

const activeStyles = {
  backgroundColor: '#cfd8dc',
  margin: '50px -20px 50px -20px',
};

const firstActiveStyles = {
  ...activeStyles,
  margin: '6px -20px 50px -20px'
};

export const expansionAnimation = trigger('expansionState', [
  state('inactive', style(inactiveStyles)),
  state('active',   style(activeStyles)),
  state('firstActive', style(firstActiveStyles)),
  transition('inactive => active', animate('100ms ease-in')),
  transition('active => inactive', animate('100ms ease-out')),
  transition('inactive => firstActive', animate('100ms ease-out')),
  transition('firstActive => inactive', animate('100ms ease-out')),
]);

export class ExpansionStates {

  static get Inactive() {
    return 'inactive';
  }

  static get Active() {
    return 'active';
  }

  static get FirstActive() {
    return 'firstActive';
  }

}
