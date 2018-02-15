import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFanficComponent } from './new-fanfic.component';

describe('NewFanficComponent', () => {
  let component: NewFanficComponent;
  let fixture: ComponentFixture<NewFanficComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFanficComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFanficComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
