import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhLayoutCrudComponent } from './wh-layout-crud.component';

describe('WhLayoutCrudComponent', () => {
  let component: WhLayoutCrudComponent;
  let fixture: ComponentFixture<WhLayoutCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhLayoutCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhLayoutCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
