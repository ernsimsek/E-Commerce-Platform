import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService } from '../../../../services/common/models/product.service';
import { Create_Product } from '../../../../contracts/create_product';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  standalone: false,
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends BaseComponent implements OnInit {
  productForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isSubmitting: boolean = false;

  @Output() createdProduct: EventEmitter<Create_Product> = new EventEmitter();

  constructor(
    spinnerService: NgxSpinnerService, 
    private productService: ProductService, 
    private alertify: AlertifyService,
    private fb: FormBuilder
  ) {
    super(spinnerService);
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      type: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  createProduct() {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    this.isSubmitting = true;
    this.showSpinner(SpinnerType.BallAtom);
    
    const formValues = this.productForm.value;
    
    // Form verilerini loglayalım
    console.log("Creating product with form values:", formValues);
    
    const create_product: Create_Product = new Create_Product();
    create_product.name = formValues.name;
    create_product.stock = formValues.stock;
    create_product.price = formValues.price;
    create_product.type = formValues.type;
    
    console.log("Product object created:", create_product);
    console.log("JSON data to be sent:", JSON.stringify(create_product));
    
    this.productService.create(create_product, () => {
      this.hideSpinner(SpinnerType.BallAtom);
      this.isSubmitting = false;
      this.successMessage = "Ürün başarıyla oluşturuldu!";
      this.alertify.message("Ürün başarıyla oluşturuldu!", {
        delay: 3000,
        dismissOthers: true,
        messageType: MessageType.Success,
        position: Position.TopRight
      });
      this.resetForm();
      this.createdProduct.emit(create_product);
    }, errorMessage => {
      this.hideSpinner(SpinnerType.BallAtom);
      this.isSubmitting = false;
      this.errorMessage = errorMessage;
      this.alertify.message(errorMessage, {
        delay: 3000,
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      });
    });
  }

  resetForm() {
    this.productForm.reset({
      name: '',
      stock: 0,
      price: 0,
      type: ''
    });
    this.productForm.markAsPristine();
    this.productForm.markAsUntouched();
  }

  clearMessage() {
    this.successMessage = null;
    this.errorMessage = null;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
  

