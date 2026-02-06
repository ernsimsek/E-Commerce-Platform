import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/common/models/product.service';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { List_Product } from 'src/app/contracts/list_product';
import { ToastrService } from 'ngx-toastr';
import { List_Product_Image } from 'src/app/contracts/list_product_image';

interface ProductImage {
  path: string;
  showcase: boolean;
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent extends BaseComponent implements OnInit {
  product: any;
  relatedProducts: List_Product[] = [];
  productImages: string[] = [];
  selectedImageIndex: number = 0;
  quantity: number = 1;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { 
    super(spinner);
  }

  ngOnInit(): void {
    this.showSpinner(SpinnerType.BallAtom);
    
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.getProduct(id);
        this.getRelatedProducts();
      }
    });
  }

  async getProduct(id: string): Promise<void> {
    this.productService.getById(
      id, 
      () => {
        // Success callback is handled in the Promise
      },
      (errorMessage: string) => {
        this.toastr.error(errorMessage, 'Hata');
        this.hideSpinner(SpinnerType.BallAtom);
      })
      .then(productData => {
        // API'den gelen farklı veri yapılarını standartlaştır
        if (productData) {
          // Fiyat için hem price hem de amount alanlarını kontrol et
          let price = 0;
          if (typeof productData.price === 'number') {
            price = productData.price;
          } else if (typeof productData.amount === 'number') {
            price = productData.amount;
          } else if (typeof productData.price === 'string') {
            price = parseFloat(productData.price);
          } else if (typeof productData.amount === 'string') {
            price = parseFloat(productData.amount);
          }

          // Stok için hem stock hem de value alanlarını kontrol et
          let stock = 0;
          if (typeof productData.stock === 'number') {
            stock = productData.stock;
          } else if (typeof productData.value === 'number') {
            stock = productData.value;
          } else if (typeof productData.stock === 'string') {
            stock = parseInt(productData.stock);
          } else if (typeof productData.value === 'string') {
            stock = parseInt(productData.value);
          }

          // Sayısal değerlerin geçerliliğini kontrol et
          if (isNaN(price)) price = 0;
          if (isNaN(stock)) stock = 0;

          console.log(`Product Detail | ID: ${id} | Price: ${price} | Stock: ${stock}`);

          // Düzenlenmiş veriyi product nesnesine ata
          this.product = {
            ...productData,
            price: price,
            stock: stock,
            // UI için gerekli ek alanlar
            isInStock: stock > 0,
            discountedPrice: price,
            rating: 4.5,
            reviewCount: 18,
            isNew: false,
            isBestseller: false,
            discount: 0,
            specifications: {
              brand: productData.brand || 'Generic',
              model: 'Model ' + (Math.floor(Math.random() * 1000) + 1),
              color: 'Siyah',
              storage: '64GB'
            },
            features: [
              'Yüksek kalite',
              'Dayanıklı malzeme',
              'Kolay kullanım',
              '1 yıl garanti'
            ]
          };

          // Ürün resimlerini yükle
          this.loadProductImages(id);
        }
        this.hideSpinner(SpinnerType.BallAtom);
      });
  }
  
  loadProductImages(id: string): void {
    this.productService.readImages(
      id, 
      () => {
        // Success callback is handled in the Promise
      },
      (errorMessage: string) => {
        this.toastr.error(errorMessage, 'Resimler yüklenirken hata oluştu');
      })
      .then(images => {
        if (images && images.length > 0) {
          // Check if there's a showcase image
          const showcaseImage = images.find(img => img.showcase);
          
          if (showcaseImage) {
            // Put the showcase image first in the array
            this.productImages = [showcaseImage.path];
            // Add the rest of the images
            images.filter(img => !img.showcase).forEach(img => {
              this.productImages.push(img.path);
            });
          } else {
            // No showcase image, just use all images
            this.productImages = images.map(img => img.path);
          }
        } else {
          // Use fallback images if no images are returned
          this.productImages = ['assets/products/default-product.jpg'];
        }
      });
  }
  
  getRelatedProducts(): void {
    // Normalde backend'den gelecek
    this.relatedProducts = [
      { 
        id: '2', 
        name: 'Samsung Galaxy S21', 
        price: 8999, 
        stock: 45, 
        createdDate: new Date(), 
        updatedDate: new Date(), 
        productImageFiles: [], 
        imagePath: 'assets/products/product2.jpg',
        description: 'Samsung Galaxy S21 güçlü özellikleriyle dikkat çekiyor',
        brand: 'Samsung',
        type: 'Elektronik'
      },
      { 
        id: '3', 
        name: 'Xiaomi Mi 11', 
        price: 5999, 
        stock: 30, 
        createdDate: new Date(), 
        updatedDate: new Date(), 
        productImageFiles: [], 
        imagePath: 'assets/products/product3.jpg',
        description: 'Xiaomi Mi 11 yüksek performanslı kamerası ile öne çıkıyor',
        brand: 'Xiaomi',
        type: 'Elektronik'
      },
      { 
        id: '4', 
        name: 'OnePlus 9 Pro', 
        price: 9499, 
        stock: 15, 
        createdDate: new Date(), 
        updatedDate: new Date(), 
        productImageFiles: [], 
        imagePath: 'assets/products/product4.jpg',
        description: 'OnePlus 9 Pro hızlı şarj özelliği ile fark yaratıyor',
        brand: 'OnePlus',
        type: 'Elektronik'
      },
      { 
        id: '5', 
        name: 'Huawei P50 Pro', 
        price: 10499, 
        stock: 20, 
        createdDate: new Date(), 
        updatedDate: new Date(), 
        productImageFiles: [], 
        imagePath: 'assets/products/product5.jpg',
        description: 'Huawei P50 Pro profesyonel kamera sistemi ile eşsiz',
        brand: 'Huawei',
        type: 'Elektronik'
      }
    ];
  }
  
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }
  
  incrementQuantity(): void {
    if (this.quantity < this.product.stock) {
      this.quantity++;
    }
  }
  
  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  
  addToCart(): void {
    // Sepete ekleme işlemi
    this.toastr.success(`${this.product.name} sepete eklendi`, 'Sepete Eklendi');
  }
  
  addToFavorites(): void {
    // Favorilere ekleme işlemi
    this.toastr.success(`${this.product.name} favorilere eklendi`, 'Favorilere Eklendi');
  }
} 