import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompetencyDialogComponent } from './create-competency-dialog.component';

describe('CreateCompetencyDialogComponent', () => {
  let component: CreateCompetencyDialogComponent;
  let fixture: ComponentFixture<CreateCompetencyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCompetencyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCompetencyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
