import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YarnSellingKhataComponent } from './yarn-selling-khata.component';

describe('YarnSellingKhataComponent', () => {
  let component: YarnSellingKhataComponent;
  let fixture: ComponentFixture<YarnSellingKhataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YarnSellingKhataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YarnSellingKhataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
