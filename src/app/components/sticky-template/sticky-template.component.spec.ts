import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyTemplateComponent } from './sticky-template.component';

describe('StickyTemplateComponent', () => {
  let component: StickyTemplateComponent;
  let fixture: ComponentFixture<StickyTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StickyTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickyTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
