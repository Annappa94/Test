import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocoonSplitingComponent } from './cocoon-spliting.component';

describe('CocoonSplitingComponent', () => {
  let component: CocoonSplitingComponent;
  let fixture: ComponentFixture<CocoonSplitingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CocoonSplitingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CocoonSplitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
