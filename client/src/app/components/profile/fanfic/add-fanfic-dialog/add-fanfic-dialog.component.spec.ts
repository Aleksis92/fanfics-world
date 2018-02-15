import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFanficDialogComponent } from './add-fanfic-dialog.component';

describe('AddFanficDialogComponent', () => {
  let component: AddFanficDialogComponent;
  let fixture: ComponentFixture<AddFanficDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFanficDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFanficDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
