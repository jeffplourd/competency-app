import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ca-sticky-template',
  templateUrl: './sticky-template.component.html',
  styleUrls: ['./sticky-template.component.scss']
})
export class StickyTemplateComponent implements OnInit {

  @Input() id: string;
  @Input() sticky: boolean;
  @Input() top?: string;
  @Input() bottom?: string;
  @Input() stickyTemplate: any;

  constructor(public elementRef: ElementRef) { }

  ngOnInit() {}

  get styles() {
    const styles = {};

    if (this.top) {
      styles['top'] = this.top;
    }

    if (this.bottom) {
      styles['bottom'] = this.bottom;
    }

    return styles;
  }
}
