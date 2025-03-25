import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelReportImageComponent } from './excel-report-image.component';

describe('ExcelReportImageComponent', () => {
  let component: ExcelReportImageComponent;
  let fixture: ComponentFixture<ExcelReportImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelReportImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcelReportImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
