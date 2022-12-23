import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocoonListComponent } from './cocoon-list.component';

describe('CocoonListComponent', () => {
  let component: CocoonListComponent;
  let fixture: ComponentFixture<CocoonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CocoonListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CocoonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
