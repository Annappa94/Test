import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OilSpinningMillListComponent } from './oil-spinning-mill-list.component';

describe('OilSpinningMillListComponent', () => {
  let component: OilSpinningMillListComponent;
  let fixture: ComponentFixture<OilSpinningMillListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OilSpinningMillListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OilSpinningMillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
