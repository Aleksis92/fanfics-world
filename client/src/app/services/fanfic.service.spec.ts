import { TestBed, inject } from '@angular/core/testing';

import { FanficService } from './fanfic.service';

describe('FanficService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FanficService]
    });
  });

  it('should be created', inject([FanficService], (service: FanficService) => {
    expect(service).toBeTruthy();
  }));
});
