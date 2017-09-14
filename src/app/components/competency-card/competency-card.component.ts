import { Component, Input } from '@angular/core';

@Component({
  selector: 'ca-competency-card',
  templateUrl: './competency-card.component.html',
  styleUrls: ['./competency-card.component.scss']
})
export class CompetencyCardComponent  {

  @Input() competency;

  constructor() { }

}
