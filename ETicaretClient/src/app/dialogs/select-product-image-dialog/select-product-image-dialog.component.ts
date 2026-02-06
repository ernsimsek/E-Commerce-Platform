import { Component, Inject, OnInit, Output } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileUploadOptions } from '../../services/common/file-upload/file-upload.component';
import { ProductService } from '../../services/common/models/product.service';
import { List_Product_Image } from '../../contracts/list_product_image';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { MatCard } from '@angular/material/card';
import { DialogService } from '../../services/common/dialog.service';
import { DeleteDialogComponent, DeleteState } from '../delete-dialog/delete-dialog.component';
import { AlertifyService, MessageType, Position } from '../../services/admin/alertify.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any

@Component({
  selector: 'app-select-product-image-dialog',
  standalone: false,
  
  templateUrl: './select-product-image-dialog.component.html',
  styleUrl: './select-product-image-dialog.component.scss'
})
export class SelectProductImageDialogComponent extends BaseDialog<SelectProductImageDialogComponent> implements OnInit{

  @Output() options: Partial<FileUploadOptions>;
  productId: string;
  images: List_Product_Image[] = [];
  
  constructor(dialogRef: MatDialogRef<SelectProductImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectProductImageState | string,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService,
    private alertify: AlertifyService,
    private router: Router) {
    super(dialogRef)
    
    console.log("SelectProductImageDialog: Dialog açıldı, Ürün ID:", data);
    this.productId = data as string;

    // Token kontrolü
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("SelectProductImageDialog: Token bulunamadı!");
      this.alertify.message("Yetkilendirme hatası. Lütfen tekrar giriş yapın.", {
        delay: 3000,
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      });
      
      // Kullanıcıyı login sayfasına yönlendir
      setTimeout(() => {
        dialogRef.close();
        this.router.navigate(['/login']);
      }, 2000);
    }

    this.options = {  
      accept: ".png, .jpg, .jpeg, .gif",
      action: "upload",
      controller: "products",
      explanation: "Ürün resmini seçin veya buraya sürükleyin...",
      isAdminPage: true,
      queryString: `Id=${this.productId}`
    };
    
    console.log("SelectProductImageDialog: File upload options:", this.options);
  }
  
  async ngOnInit() {
    console.log("SelectProductImageDialog: ngOnInit başladı");
    this.spinner.show(SpinnerType.BallAtom);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        this.spinner.hide(SpinnerType.BallAtom);
        console.error("SelectProductImageDialog: Token bulunamadı!");
        return;
      }
      
      console.log(`SelectProductImageDialog: ${this.productId} ID'li ürünün resimleri getiriliyor`);
      this.images = await this.productService.readImages(this.productId, () => {
        this.spinner.hide(SpinnerType.BallAtom);
        console.log(`SelectProductImageDialog: ${this.images.length} adet resim yüklendi`);
      });
      
      // Resimlerin detaylarını görüntüle
      if (this.images && this.images.length > 0) {
        console.log("SelectProductImageDialog: Resim bilgileri:", 
          this.images.map(img => ({ id: img.id, fileName: img.fileName, showcase: img.showcase })));
      }
    } catch (error) {
      this.spinner.hide(SpinnerType.BallAtom);
      console.error("SelectProductImageDialog: Resimler yüklenirken hata oluştu", error);
      this.alertify.message("Resimler yüklenirken hata oluştu. Lütfen tekrar deneyin.", {
        delay: 3000,
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      });
      
      if (error instanceof HttpErrorResponse && error.status === 401) {
        localStorage.removeItem("accessToken");
        setTimeout(() => {
          this.dialogRef.close();
          this.router.navigate(['/login']);
        }, 2000);
      }
    }
  }

  async refreshImages() {
    console.log("SelectProductImageDialog: Resimler yenileniyor");
    this.spinner.show(SpinnerType.BallAtom);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        this.spinner.hide(SpinnerType.BallAtom);
        console.error("SelectProductImageDialog: Token bulunamadı!");
        return;
      }
      
      this.images = await this.productService.readImages(this.productId, () => {
        this.spinner.hide(SpinnerType.BallAtom);
        this.alertify.message("Resimler başarıyla yenilendi", {
          delay: 3000,
          dismissOthers: true,
          messageType: MessageType.Success,
          position: Position.TopRight
        });
      });
      
      // Log image information for debugging
      if (this.images && this.images.length > 0) {
        console.log(`SelectProductImageDialog: ${this.images.length} resim yenilendi`);
      }
    } catch (error) {
      this.spinner.hide(SpinnerType.BallAtom);
      console.error("SelectProductImageDialog: Resimler yenilenirken hata oluştu", error);
      this.alertify.message("Resimler yenilenirken hata oluştu.", {
        delay: 3000,
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      });
    }
  }

  // Resim yükleme hatası durumunda varsayılan resmi göster
  onImageError(event: any): void {
    console.log('Resim yükleme hatası:', event);
    event.target.src = '../../../../../assets/default-product.png';
  }

  async deleteImage(imageId: string, event: any) {
    console.log(`SelectProductImageDialog: ${imageId} ID'li resim silme başlatılıyor`);
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async() => {
        try {
          this.spinner.show(SpinnerType.BallAtom);
          
          const token = localStorage.getItem("accessToken");
          if (!token) {
            this.spinner.hide(SpinnerType.BallAtom);
            console.error("SelectProductImageDialog: Token bulunamadı!");
            return;
          }
          
          // Güvenlik kontrolü: imageId veya productId null/undefined olmamalı
          if (!imageId || !this.productId) {
            this.spinner.hide(SpinnerType.BallAtom);
            console.error("SelectProductImageDialog: Geçersiz resim ID veya ürün ID!");
            this.alertify.message("Geçersiz resim veya ürün ID", {
              delay: 3000,
              dismissOthers: true,
              messageType: MessageType.Error,
              position: Position.TopRight
            });
            return;
          }
          
          await this.productService.deleteImage(this.productId, imageId, () => {
            this.spinner.hide(SpinnerType.BallAtom);
            var card = $(event.srcElement).parent().parent();
            card.fadeOut(500);
            this.alertify.message("Resim başarıyla silindi", {
              delay: 3000,
              dismissOthers: true,
              messageType: MessageType.Success,
              position: Position.TopRight
            });
          });
        } catch (error) {
          this.spinner.hide(SpinnerType.BallAtom);
          console.error("SelectProductImageDialog: Resim silinirken hata oluştu", error);
          this.alertify.message("Resim silinirken hata oluştu.", {
            delay: 3000,
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight
          });
        }
      }
    });  
  }
  
  async showCase(imageId: string) {
    console.log(`SelectProductImageDialog: ${imageId} ID'li resim vitrin resmi olarak ayarlanıyor`);
    try {
      this.spinner.show(SpinnerType.BallAtom);
      
      const token = localStorage.getItem("accessToken");
      if (!token) {
        this.spinner.hide(SpinnerType.BallAtom);
        console.error("SelectProductImageDialog: Token bulunamadı!");
        return;
      }
      
      // Güvenlik kontrolü: imageId veya productId null/undefined olmamalı
      if (!imageId || !this.productId) {
        this.spinner.hide(SpinnerType.BallAtom);
        console.error("SelectProductImageDialog: Geçersiz resim ID veya ürün ID!");
        this.alertify.message("Geçersiz resim veya ürün ID", {
          delay: 3000,
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight
        });
        return;
      }
      
      this.productService.changeShowcaseImage(imageId, this.productId, () => {
        this.spinner.hide(SpinnerType.BallAtom);
        this.alertify.message("Vitrin resmi başarıyla güncellendi", {
          delay: 3000,
          dismissOthers: true,
          messageType: MessageType.Success,
          position: Position.TopRight
        });
        
        // İşlem başarılı olduktan sonra resimleri yenile
        this.refreshImages();
      });
    } catch (error) {
      this.spinner.hide(SpinnerType.BallAtom);
      console.error("SelectProductImageDialog: Vitrin resmi güncellenirken hata oluştu", error);
      this.alertify.message("Vitrin resmi güncellenirken hata oluştu.", {
        delay: 3000,
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      });
    }
  }
  
  onFilesUploaded() {
    console.log("SelectProductImageDialog: Dosya yükleme tamamlandı, resimler yenileniyor");
    this.refreshImages();
  }
}

export enum SelectProductImageState{
  close
}

