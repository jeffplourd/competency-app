import { TestBed, inject } from '@angular/core/testing';

import { CompetencyService } from './competency.service';

describe('CompetencyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompetencyService]
    });
  });

  it('should be created', inject([CompetencyService], (service: CompetencyService) => {
    expect(service).toBeTruthy();
  }));
});
