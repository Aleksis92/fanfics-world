import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleUserDialogComponent } from './role-user-dialog.component';

describe('RoleUserDialogComponent', () => {
  let component: RoleUserDialogComponent;
  let fixture: ComponentFixture<RoleUserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleUserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
