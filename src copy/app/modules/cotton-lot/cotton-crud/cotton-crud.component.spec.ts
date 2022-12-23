import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottonCrudComponent } from './cotton-crud.component';

describe('CottonCrudComponent', () => {
  let component: CottonCrudComponent;
  let fixture: ComponentFixture<CottonCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CottonCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CottonCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
