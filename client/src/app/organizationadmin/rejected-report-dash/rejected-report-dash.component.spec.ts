import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedReportDashComponent } from './rejected-report-dash.component';

describe('RejectedReportDashComponent', () => {
  let component: RejectedReportDashComponent;
  let fixture: ComponentFixture<RejectedReportDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedReportDashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedReportDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
