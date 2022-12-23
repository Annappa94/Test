import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TussarReelerDetailsComponent } from './tussar-reeler-details.component';

describe('TussarReelerDetailsComponent', () => {
  let component: TussarReelerDetailsComponent;
  let fixture: ComponentFixture<TussarReelerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TussarReelerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TussarReelerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
