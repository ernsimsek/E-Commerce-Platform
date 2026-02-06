import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClientService } from '../../../services/common/http-client.service';
import { Create_Product } from '../../../contracts/create_product';
import { ListComponent } from './list/list.component';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';

@Component({
  selector: 'app-products',
  standalone: false,
  
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent extends BaseComponent implements OnInit{

constructor(
  spinner: NgxSpinnerService, 
  private httpClientService: HttpClientService,
  private alertify: AlertifyService
){
  super(spinner)
}
ngOnInit(): void {
  
}

@ViewChild(ListComponent) listComponent!: ListComponent;

refreshProducts(): void {
  this.showSpinner(SpinnerType.BallAtom);
  if (this.listComponent) {
    this.listComponent.refreshProducts();
  }
  this.hideSpinner(SpinnerType.BallAtom);
}

createdProduct(createdProduct: Create_Product) {
  this.refreshProducts();
}

applyFilter(filterValue: string): void {
  if (this.listComponent) {
    this.listComponent.applyFilter(filterValue);
  }
}

}
