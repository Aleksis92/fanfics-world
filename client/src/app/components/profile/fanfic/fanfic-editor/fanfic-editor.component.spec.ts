import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FanficEditorComponent } from './fanfic-editor.component';

describe('EditFanficComponent', () => {
  let component: FanficEditorComponent;
  let fixture: ComponentFixture<FanficEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FanficEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FanficEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
