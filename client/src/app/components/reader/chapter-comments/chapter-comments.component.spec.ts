import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterCommentsComponent } from './chapter-comments.component';

describe('ChapterCommentsComponent', () => {
  let component: ChapterCommentsComponent;
  let fixture: ComponentFixture<ChapterCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChapterCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
