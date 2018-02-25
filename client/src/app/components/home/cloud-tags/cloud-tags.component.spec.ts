import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CloudTagsComponent} from './cloud-tags.component';

describe('CloudTagsComponent', () => {
  let component: CloudTagsComponent;
  let fixture: ComponentFixture<CloudTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CloudTagsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
