import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelWithPhotosComponent } from './excel-with-photos.component';

describe('ExcelWithPhotosComponent', () => {
  let component: ExcelWithPhotosComponent;
  let fixture: ComponentFixture<ExcelWithPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelWithPhotosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcelWithPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
