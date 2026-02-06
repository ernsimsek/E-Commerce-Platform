import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../../models/product.model';
import * as ProductActions from '../../../store/product/product.actions';
import * as ProductSelectors from '../../../store/product/product.selectors';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      pictureUrl: [''],
      brand: [''],
      type: [''],
      quantityInStock: ['', [Validators.required, Validators.min(0)]]
    });

    this.loading$ = this.store.select(ProductSelectors.selectProductLoading);
    this.error$ = this.store.select(ProductSelectors.selectProductError);
  }

  ngOnInit(): void {
    // If editing, load product data
    if (this.productId) {
      this.store.dispatch(ProductActions.loadProduct({ id: this.productId }));
      this.store.select(ProductSelectors.selectSelectedProduct).subscribe(product => {
        if (product) {
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            pictureUrl: product.pictureUrl,
            brand: product.brand,
            type: product.type,
            quantityInStock: product.quantityInStock
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = {
        id: this.productId || 0,
        ...this.productForm.value
      };

      if (this.isEditMode) {
        this.store.dispatch(ProductActions.updateProduct({ product }));
      } else {
        this.store.dispatch(ProductActions.createProduct({ product }));
      }
    }
  }
} 