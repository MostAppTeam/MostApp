import { TestBed } from '@angular/core/testing';

import { ShoppingCenterService } from './shopping-center.service';

describe('ShoppingCenterService', () => {
  let service: ShoppingCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
