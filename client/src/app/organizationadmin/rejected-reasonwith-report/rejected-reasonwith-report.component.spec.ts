import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedReasonwithReportComponent } from './rejected-reasonwith-report.component';

describe('RejectedReasonwithReportComponent', () => {
  let component: RejectedReasonwithReportComponent;
  let fixture: ComponentFixture<RejectedReasonwithReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedReasonwithReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedReasonwithReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
