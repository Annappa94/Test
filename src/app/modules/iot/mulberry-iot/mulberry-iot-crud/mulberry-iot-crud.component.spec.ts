import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MulberryIotCrudComponent } from './mulberry-iot-crud.component';

describe('MulberryIotCrudComponent', () => {
  let component: MulberryIotCrudComponent;
  let fixture: ComponentFixture<MulberryIotCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MulberryIotCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MulberryIotCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
