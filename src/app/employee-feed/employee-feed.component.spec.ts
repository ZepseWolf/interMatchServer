import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeFeedComponent } from './employee-feed.component';

describe('EmployeeFeedComponent', () => {
  let component: EmployeeFeedComponent;
  let fixture: ComponentFixture<EmployeeFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
