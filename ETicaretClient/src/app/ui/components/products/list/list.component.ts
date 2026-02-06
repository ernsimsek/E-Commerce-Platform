import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/common/models/product.service';
import { error } from 'console';
import { List_Product } from '../../../../contracts/list_product';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../../../../services/common/models/file.service';
import { BaseUrl } from '../../../../contracts/base_url';

@Component({
  selector: 'app-list',
  standalone: false,

  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private fileService: FileService
  ) {}

  currentPageNo: number = 1;
  totalProductCount: number = 0;
  totalPageCount: number = 0;
  pageSize: number = 12;
  pageList: number[] = [];
  baseUrl: BaseUrl = new BaseUrl();
  products: List_Product[] = [];

  // Resim yükleme hatası durumunda varsayılan resmi göster
  onImageError(event: any): void {
    console.log('Resim yükleme hatası:', event);
    event.target.src = '../../../../../assets/default-product.png';
  }

  /**
   * Ürünün vitrin resmini bulup URL'ini döndürür.
   * Eğer vitrin resmi yoksa null döndürür.
   */
  getShowcaseImage(product: List_Product): string | null {
    if (!product?.productImageFiles || !Array.isArray(product.productImageFiles) || product.productImageFiles.length === 0) {
      return null;
    }
    
    // Vitrin olarak işaretlenmiş resmi ara
    const showcaseImage = product.productImageFiles.find(img => img.showcase === true);
    
    if (showcaseImage && showcaseImage.fileName) {
      console.log(`Vitrin resmi bulundu: ${showcaseImage.fileName}`);
      return 'https://localhost:7136/api/Files/photo-image/' + showcaseImage.fileName;
    }
    
    // Vitrin resmi bulunamadıysa en son eklenen resmi kullan
    // Not: API'den gelen sıralama bu şekilde olmalıdır
    const latestImage = product.productImageFiles[product.productImageFiles.length - 1];
    console.log(`Vitrin resmi bulunamadı, en son eklenen resim kullanılıyor: ${latestImage.fileName}`);
    return 'https://localhost:7136/api/Files/photo-image/' + latestImage.fileName;
  }

  async ngOnInit() {
    this.baseUrl = await this.fileService.getBaseStorageUrl();
    this.activatedRoute.paramMap.subscribe(async (params) => {
      this.currentPageNo = Number(params.get('pageNo') || 1);

      const data: { totalProductCount: number; products: any[] } =
        await this.productService.read(
          this.currentPageNo - 1,
          this.pageSize,
          () => {},
          (errorMessage) => {}
        );

      // Log the product data to see what we're working with
      console.log("Products from API:", JSON.stringify(data.products));

      // Tip güvenliği için dönüştürme
      this.products = data.products.map<List_Product>(p => {
        try {
          // Geçersiz veya eksik veri kontrolü
          if (!p || !p.id) {
            console.error("ListComponent: Geçersiz ürün verisi:", p);
            return new List_Product(); // Boş ürün nesnesi döndür
          }

          // API'dan gelen farklı veri yapılarını standartlaştır
          // API'dan gelen ham veriyi 'any' tipinde işleyelim
          const rawItem: any = p;
          
          // Fiyat için farklı isimlendirmeleri kontrol et
          let price = 0;
          if (typeof rawItem.price === 'number') {
            price = rawItem.price;
          } else if (typeof rawItem.amount === 'number') {
            price = rawItem.amount;
          } else if (typeof rawItem.price === 'string') {
            price = parseFloat(rawItem.price);
          } else if (typeof rawItem.amount === 'string') {
            price = parseFloat(rawItem.amount);
          }

          // Stok için farklı isimlendirmeleri kontrol et
          let stock = 0;
          if (typeof rawItem.stock === 'number') {
            stock = rawItem.stock;
          } else if (typeof rawItem.value === 'number') {
            stock = rawItem.value;
          } else if (typeof rawItem.stock === 'string') {
            stock = parseInt(rawItem.stock);
          } else if (typeof rawItem.value === 'string') {
            stock = parseInt(rawItem.value);
          }

          // Sayısal değerlerin geçerliliğini kontrol et
          if (isNaN(price)) price = 0;
          if (isNaN(stock)) stock = 0;

          console.log(`Product ${p.id} | Name: ${p.name} | Price: ${price} | Stock: ${stock}`);

          // Create a proper List_Product object with all the data
          const listProduct: List_Product = {
              id: p.id || '',
              createdDate: p.createdDate ? new Date(p.createdDate) : new Date(),
              imagePath: undefined, // Using undefined instead of null to satisfy TypeScript
              name: p.name || 'İsimsiz Ürün',
              price: price,
              stock: stock,
              updatedDate: p.updatedDate ? new Date(p.updatedDate) : new Date(),
              productImageFiles: Array.isArray(p.productImageFiles) ? p.productImageFiles : [], // Diziye dönüştür
              description: p.description || '',
              brand: p.brand || '',
              type: p.type || ''
          };
          
          // Log the product image files to debug
          if (p.productImageFiles && Array.isArray(p.productImageFiles) && p.productImageFiles.length > 0) {
            const firstImage = p.productImageFiles[0];
            console.log(`Product ${p.id} has ${p.productImageFiles.length} images. First image:`, 
                        firstImage?.fileName ? firstImage.fileName : 'No fileName property');
          } else {
            console.log(`Product ${p.id} has no images`);
          }
          
          return listProduct;
        } catch (error) {
          console.error("ListComponent: Ürün işleme hatası:", error, "Ürün:", p);
          return new List_Product(); // Hata durumunda boş ürün nesnesi döndür
        }
      });
    
      this.totalProductCount = data.totalProductCount;
      this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);
      this.pageList = [];
      if (this.currentPageNo - 3 <= 0)
        for (let i = 1; i <= 7; i++) this.pageList.push(i);
      else if (this.currentPageNo + 3 >= this.totalPageCount)
        for (let i = this.totalPageCount - 6; i <= this.totalPageCount; i++)
          this.pageList.push(i);
      else
        for (let i = this.currentPageNo - 3; i <= this.currentPageNo + 3; i++)
          this.pageList.push(i);
    });
  }
}
