import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionListItemComponent } from './expansion-list-item.component';

describe('ExpansionListItemComponent', () => {
  let component: ExpansionListItemComponent;
  let fixture: ComponentFixture<ExpansionListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpansionListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
