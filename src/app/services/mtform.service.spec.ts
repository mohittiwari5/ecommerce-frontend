import { TestBed } from '@angular/core/testing';

import { MTFormService } from './mtform.service';

describe('MTFormService', () => {
  let service: MTFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MTFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
