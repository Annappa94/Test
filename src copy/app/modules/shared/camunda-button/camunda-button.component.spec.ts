import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamundaButtonComponent } from './camunda-button.component';

describe('CamundaButtonComponent', () => {
  let component: CamundaButtonComponent;
  let fixture: ComponentFixture<CamundaButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CamundaButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamundaButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
