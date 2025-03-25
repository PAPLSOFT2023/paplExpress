import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
// import { Router } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-master-home',
  templateUrl: './product-master-home.component.html',
  styleUrls: ['./product-master-home.component.scss']
})
export class ProductMasterHomeComponent {
   constructor(private http: HttpClient, private router: Router) {}
 
  redirect(){
    this.router.navigate(['organization_master']);

    
  }
  
  redirect1(){
    this.router.navigate(['type_master']);

    
  }

  redirect2(){
    this.router.navigate(['product_master']);

    
  }

}
