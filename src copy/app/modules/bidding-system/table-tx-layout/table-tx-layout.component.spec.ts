import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTxLayoutComponent } from './table-tx-layout.component';

describe('TableTxLayoutComponent', () => {
  let component: TableTxLayoutComponent;
  let fixture: ComponentFixture<TableTxLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableTxLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTxLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
