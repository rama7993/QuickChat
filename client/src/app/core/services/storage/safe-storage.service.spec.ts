import { TestBed } from '@angular/core/testing';

import { SafeStorageService } from './safe-storage.service';

describe('SafeStorageService', () => {
  let service: SafeStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
