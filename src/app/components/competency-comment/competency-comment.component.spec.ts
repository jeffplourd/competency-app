import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyCommentComponent } from './competency-comment.component';

describe('CompetencyCommentComponent', () => {
  let component: CompetencyCommentComponent;
  let fixture: ComponentFixture<CompetencyCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetencyCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
