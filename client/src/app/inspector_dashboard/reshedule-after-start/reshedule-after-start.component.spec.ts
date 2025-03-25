import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResheduleAfterStartComponent } from './reshedule-after-start.component';

describe('ResheduleAfterStartComponent', () => {
  let component: ResheduleAfterStartComponent;
  let fixture: ComponentFixture<ResheduleAfterStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResheduleAfterStartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResheduleAfterStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
