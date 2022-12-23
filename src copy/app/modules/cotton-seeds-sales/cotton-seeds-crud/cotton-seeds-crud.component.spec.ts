import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottonSeedsCrudComponent } from './cotton-seeds-crud.component';

describe('CottonSeedsCrudComponent', () => {
  let component: CottonSeedsCrudComponent;
  let fixture: ComponentFixture<CottonSeedsCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CottonSeedsCrudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CottonSeedsCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
