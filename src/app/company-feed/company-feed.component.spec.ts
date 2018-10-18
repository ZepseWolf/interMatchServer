import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFeedComponent } from './company-feed.component';

describe('CompanyFeedComponent', () => {
  let component: CompanyFeedComponent;
  let fixture: ComponentFixture<CompanyFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
