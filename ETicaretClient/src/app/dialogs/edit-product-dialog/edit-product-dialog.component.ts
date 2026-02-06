import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../base/base.component';
import { ProductService } from '../../services/common/models/product.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service';

@Component({
  selector: 'app-edit-product-dialog',
  templateUrl: './edit-product-dialog.component.html',
  styleUrls: ['./edit-product-dialog.component.scss']
})
export class EditProductDialogComponent extends BaseComponent implements OnInit {
  productForm!: FormGroup;
  
  constructor(
    private dialogRef: MatDialogRef<EditProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string, name: string, stock: number, price: number, description: string, brand?: string, type?: string },
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private toastr: CustomToastrService,
    spinner: NgxSpinnerService
  ) {
    super(spinner);
  }

  // Getter for easy access to form controls in the template
  get f() {
    return this.productForm.controls;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    // Only include name, price, and stock in the form
    this.productForm = this.formBuilder.group({
      name: [this.data.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      price: [this.data.price, [Validators.required, Validators.min(0.01)]],
      stock: [this.data.stock, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.showSpinner(SpinnerType.BallAtom);

    // Combine form values with original data to preserve description, brand, and type
    const updatedProduct = {
      id: this.data.id,
      ...this.productForm.value,
      description: this.data.description || "",
      brand: this.data.brand || "",
      type: this.data.type || ""
    };

    console.log("Updating product:", updatedProduct);

    this.productService.update(updatedProduct, 
      () => {
        this.hideSpinner(SpinnerType.BallAtom);
        this.toastr.message("Ürün başarıyla güncellendi", "Başarılı", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });
        this.dialogRef.close(true);
      }, 
      (errorMessage: string) => {
        this.hideSpinner(SpinnerType.BallAtom);
        this.toastr.message(errorMessage, "Hata", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
} 