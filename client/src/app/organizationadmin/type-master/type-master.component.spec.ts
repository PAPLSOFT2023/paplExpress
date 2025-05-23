import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeMasterComponent } from './type-master.component';

describe('TypeMasterComponent', () => {
  let component: TypeMasterComponent;
  let fixture: ComponentFixture<TypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
