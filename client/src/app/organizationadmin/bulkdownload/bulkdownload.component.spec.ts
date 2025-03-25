import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkdownloadComponent } from './bulkdownload.component';

describe('BulkdownloadComponent', () => {
  let component: BulkdownloadComponent;
  let fixture: ComponentFixture<BulkdownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkdownloadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkdownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
