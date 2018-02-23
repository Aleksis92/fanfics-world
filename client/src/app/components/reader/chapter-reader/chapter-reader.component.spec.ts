import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterReaderComponent } from './chapter-reader.component';

describe('ChapterReaderComponent', () => {
  let component: ChapterReaderComponent;
  let fixture: ComponentFixture<ChapterReaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChapterReaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
