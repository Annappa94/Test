import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturedInventoryComponent } from './manufactured-inventory.component';

describe('ManufacturedInventoryComponent', () => {
  let component: ManufacturedInventoryComponent;
  let fixture: ComponentFixture<ManufacturedInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufacturedInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturedInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
