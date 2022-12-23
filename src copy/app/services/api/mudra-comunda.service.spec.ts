import { TestBed } from '@angular/core/testing';

import { MudraComundaService } from './mudra-comunda.service';

describe('MudraComundaService', () => {
  let service: MudraComundaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MudraComundaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
