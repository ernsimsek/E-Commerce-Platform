import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { FileUploadService } from '../../services/file-upload.service';
import * as ProductActions from '../../store/product/product.actions';
import * as ProductSelectors from '../../store/product/product.selectors';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  selectedFile: File | null = null;
  uploadProgress = 0;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private fileUploadService: FileUploadService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      currency: ['USD', Validators.required],
      pictureUrl: [''],
      brand: ['', Validators.required],
      type: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]]
    });

    this.loading$ = this.store.select(ProductSelectors.selectProductLoading);
    this.error$ = this.store.select(ProductSelectors.selectProductError);
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.store.dispatch(ProductActions.loadProduct({ id: this.productId }));
      this.store.select(ProductSelectors.selectSelectedProduct).subscribe(product => {
        if (product) {
          this.productForm.patchValue(product);
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      this.uploadProgress = 0;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.valid) {
      let pictureUrl = this.productForm.get('pictureUrl')?.value;

      if (this.selectedFile) {
        try {
          pictureUrl = await this.fileUploadService.uploadFile(this.selectedFile).toPromise();
        } catch (error) {
          console.error('File upload failed:', error);
          return;
        }
      }

      const productData = {
        ...this.productForm.value,
        pictureUrl
      };

      if (this.isEditMode && this.productId) {
        this.store.dispatch(ProductActions.updateProduct({ 
          id: this.productId,
          product: productData
        }));
      } else {
        this.store.dispatch(ProductActions.createProduct({ 
          product: productData
        }));
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
} 