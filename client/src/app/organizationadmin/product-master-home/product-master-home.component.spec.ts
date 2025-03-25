import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMasterHomeComponent } from './product-master-home.component';

describe('ProductMasterHomeComponent', () => {
  let component: ProductMasterHomeComponent;
  let fixture: ComponentFixture<ProductMasterHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductMasterHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMasterHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
