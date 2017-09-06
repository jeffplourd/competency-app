import { TestBed, inject } from '@angular/core/testing';

import { EvaluationRequestService } from './evaluation-request.service';

describe('EvaluationRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EvaluationRequestService]
    });
  });

  it('should be created', inject([EvaluationRequestService], (service: EvaluationRequestService) => {
    expect(service).toBeTruthy();
  }));
});
