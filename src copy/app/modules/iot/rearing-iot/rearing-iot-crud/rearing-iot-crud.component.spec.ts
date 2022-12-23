import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RearingIotCrudComponent } from './rearing-iot-crud.component';

describe('RearingIotCrudComponent', () => {
  let component: RearingIotCrudComponent;
  let fixture: ComponentFixture<RearingIotCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RearingIotCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RearingIotCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
