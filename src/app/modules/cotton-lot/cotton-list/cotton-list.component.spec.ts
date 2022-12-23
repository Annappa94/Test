import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CottonListComponent } from './cotton-list.component';

describe('CottonListComponent', () => {
  let component: CottonListComponent;
  let fixture: ComponentFixture<CottonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CottonListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CottonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
