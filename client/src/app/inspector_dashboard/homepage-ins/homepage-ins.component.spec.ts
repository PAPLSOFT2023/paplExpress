import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageInsComponent } from './homepage-ins.component';

describe('HomepageInsComponent', () => {
  let component: HomepageInsComponent;
  let fixture: ComponentFixture<HomepageInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomepageInsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
