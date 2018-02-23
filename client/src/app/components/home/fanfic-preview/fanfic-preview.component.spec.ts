import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FanficPreviewComponent } from './fanfic-preview.component';

describe('FanficPreviewComponent', () => {
  let component: FanficPreviewComponent;
  let fixture: ComponentFixture<FanficPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FanficPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FanficPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
