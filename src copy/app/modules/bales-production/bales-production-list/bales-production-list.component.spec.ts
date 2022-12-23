import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalesProductionListComponent } from './bales-production-list.component';

describe('BalesProductionListComponent', () => {
  let component: BalesProductionListComponent;
  let fixture: ComponentFixture<BalesProductionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalesProductionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalesProductionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
