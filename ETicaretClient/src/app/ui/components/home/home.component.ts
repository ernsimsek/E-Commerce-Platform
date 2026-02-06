import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { ProductService } from '../../../services/common/models/product.service';
import { List_Product } from '../../../contracts/list_product';
import { FileService } from '../../../services/common/models/file.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseComponent implements OnInit {
  featuredProducts: List_Product[] = [];
  newProducts: List_Product[] = [];
  
  constructor(
    spinner: NgxSpinnerService,
    private productService: ProductService,
    private fileService: FileService
  ){
    super(spinner);
  }
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  async loadProducts() {
    this.showSpinner(SpinnerType.BallAtom);
    
    // Get featured products (first page, 4 items)
    const data = await this.productService.read(
      0, 8, 
      () => {
        this.hideSpinner(SpinnerType.BallAtom);
      }, 
      (errorMessage) => {
        console.error('Error loading products:', errorMessage);
        this.hideSpinner(SpinnerType.BallAtom);
      }
    );
    
    if (data && data.products) {
      this.featuredProducts = data.products.slice(0, 4);
      this.newProducts = data.products.slice(4, 8);
    }
  }
  
  // Get showcase image or latest image
  getProductImage(product: List_Product): string {
    if (!product?.productImageFiles || !Array.isArray(product.productImageFiles) || product.productImageFiles.length === 0) {
      return 'assets/default-product.png';
    }
    
    // Look for showcase image
    const showcaseImage = product.productImageFiles.find(img => img.showcase === true);
    
    if (showcaseImage && showcaseImage.fileName) {
      return 'https://localhost:7136/api/Files/photo-image/' + showcaseImage.fileName;
    }
    
    // If no showcase image, use the latest one
    const latestImage = product.productImageFiles[product.productImageFiles.length - 1];
    return 'https://localhost:7136/api/Files/photo-image/' + latestImage.fileName;
  }
  
  // Handle image errors
  onImageError(event: any): void {
    event.target.src = 'assets/default-product.png';
  }
}
