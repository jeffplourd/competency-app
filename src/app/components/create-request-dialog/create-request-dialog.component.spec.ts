import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRequestDialogComponent } from './create-request-dialog.component';

describe('CreateRequestDialogComponent', () => {
  let component: CreateRequestDialogComponent;
  let fixture: ComponentFixture<CreateRequestDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRequestDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
