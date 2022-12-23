import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbMarketplaceComponent } from './qb-marketplace.component';

describe('QbMarketplaceComponent', () => {
  let component: QbMarketplaceComponent;
  let fixture: ComponentFixture<QbMarketplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbMarketplaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QbMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
