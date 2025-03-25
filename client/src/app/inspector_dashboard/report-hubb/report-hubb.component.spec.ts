import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHubbComponent } from './report-hubb.component';

describe('ReportHubbComponent', () => {
  let component: ReportHubbComponent;
  let fixture: ComponentFixture<ReportHubbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportHubbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportHubbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
