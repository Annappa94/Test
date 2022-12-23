import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupaeSupplierListComponent } from './pupae-supplier-list.component';

describe('PupaeSupplierListComponent', () => {
  let component: PupaeSupplierListComponent;
  let fixture: ComponentFixture<PupaeSupplierListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupaeSupplierListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PupaeSupplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
