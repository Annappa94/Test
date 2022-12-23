import { TestBed } from '@angular/core/testing';

import { ComundaAPIService } from './comunda-api.service';

describe('ComundaAPIService', () => {
  let service: ComundaAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComundaAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
