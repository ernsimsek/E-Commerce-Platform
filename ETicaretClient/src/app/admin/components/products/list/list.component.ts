import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { List_Product } from '../../../../contracts/list_product';
import { ProductService } from '../../../../services/common/models/product.service';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { MatPaginator } from '@angular/material/paginator';
import { DialogService } from '../../../../services/common/dialog.service';
import { SelectProductImageDialogComponent } from '../../../../dialogs/select-product-image-dialog/select-product-image-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EditProductDialogComponent } from '../../../../dialogs/edit-product-dialog/edit-product-dialog.component';
import { MatSort } from '@angular/material/sort';
import { Observable, from, merge } from 'rxjs';
import { tap } from 'rxjs/operators';

declare var $: any;

// Sayfa yüklenme tipini belirten enum
enum LoadType {
  FirstLoad,    // İlk sayfa yüklenme
  Refresh,      // Yenileme (refresh butonu)
  Pagination,   // Sayfalama değişimi
  SortChange    // Sıralama değişimi
}

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit, AfterViewInit {

  constructor(
    spinner: NgxSpinnerService,
    private productService: ProductService, 
    private alertifyService: AlertifyService,
    private dialogService: DialogService,
    private dialog: MatDialog
  ) {
    super(spinner);
  }
    
  displayedColumns: string[] = ['name', 'stock', 'price', 'createdDate', 'updatedDate', 'photos', 'edit', 'delete'];
  dataSource: MatTableDataSource<List_Product> = new MatTableDataSource<List_Product>([]);
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  
  totalProductCount: number = 0;
  isLoadingResults: boolean = false;
  
  // İlk yükleme olup olmadığını belirten flag
  isFirstLoad: boolean = true;

  // Resim yükleme hatası durumunda varsayılan resmi göster
  onImageError(event: any): void {
    console.log('Resim yükleme hatası:', event);
    event.target.src = '../../../../../assets/default-product.png';
  }

  /**
   * En son eklenen ürün resminin URL'ini döndürür
   */
  getLatestImageUrl(element: List_Product): string {
    if (!this.hasImages(element)) {
      return '../../../../../assets/default-product.png';
    }
    
    // Ürün resimlerini en son eklenen en üstte olacak şekilde sırala (ID veya oluşturma tarihine göre)
    // Not: Eğer resim nesnelerinde createdDate alanı varsa, ona göre sıralama daha doğru olur
    const sortedImages = [...element.productImageFiles!];
    
    // Varsayalım ki en son eklenen eleman dizinin son elemanıdır
    // API'den gelen sıralama bu şekilde olmalıdır
    const latestImage = sortedImages[sortedImages.length - 1];
    
    return 'https://localhost:7136/api/Files/photo-image/' + latestImage.fileName;
  }

  /**
   * Ürünün resimleri olup olmadığını kontrol eder
   */
  hasImages(element: List_Product): boolean {
    return !!(element && element.productImageFiles && element.productImageFiles.length > 0);
  }

  /**
   * Ürünün vitrin resmi olup olmadığını kontrol eder
   * Admin panelinde kullanılmaz, ancak frontendde gereklidir
   */
  hasShowcaseImage(element: List_Product): boolean {
    if (!this.hasImages(element)) return false;
    return element.productImageFiles!.some(img => img.showcase);
  }

  /**
   * Ürünün vitrin resminin URL'ini döndürür
   * Admin panelinde kullanılmaz, ancak frontendde gereklidir
   */
  getShowcaseImage(element: List_Product): string {
    if (element && element.productImageFiles && element.productImageFiles.length > 0) {
      const showcaseImage = element.productImageFiles.find(img => img.showcase);
      if (showcaseImage) {
        return 'https://localhost:7136/api/Files/photo-image/' + showcaseImage.fileName;
      }
    }
    return this.getLatestImageUrl(element);
  }

  /**
   * Ürünün ilk resminin URL'ini döndürür
   * Admin panelinde en son eklenen resmi göstermek için kullanılır
   */
  getFirstImageUrl(element: List_Product): string {
    // Admin panelinde en son eklenen resmi göstermek için değiştirildi
    return this.getLatestImageUrl(element);
  }

  getStockClass(stock: number): string {
    if (stock <= 10) return 'text-danger';
    if (stock > 10 && stock <= 30) return 'text-warning';
    return 'text-success';
  }

  /**
   * API'dan gelen veriyi işleyip UI için uygun formata dönüştürür
   */
  processProductData(data: any): List_Product[] {
    console.log("ListComponent: Processing raw product data:", data);
    
    if (!data || !data.products || !Array.isArray(data.products)) {
      console.error("ListComponent: Invalid product data format");
      return [];
    }
    
    try {
      // API'dan gelen ürün verilerini List_Product formatına dönüştür
      const mappedProducts: List_Product[] = data.products.map((item: any) => {
        if (!item) {
          console.error("ListComponent: Found null item in products array");
          return new List_Product(); // Return an empty product object instead of null
        }
        
        console.log("ListComponent: Mapping product item:", item);
        
        const product = new List_Product();
        
        // API'dan gelen değerler ile modeli oluştur
        product.id = item.id || '';
        product.name = item.name || '';
        
        // Handle both possible stock field names and data types
        let stock = 0;
        if (typeof item.stock === 'number') {
          stock = item.stock;
        } else if (typeof item.value === 'number') {
          stock = item.value;
        } else if (typeof item.stock === 'string') {
          stock = parseInt(item.stock);
        } else if (typeof item.value === 'string') {
          stock = parseInt(item.value);
        }
        
        // Handle both possible price field names and data types
        let price = 0;
        if (typeof item.price === 'number') {
          price = item.price;
        } else if (typeof item.amount === 'number') {
          price = item.amount;
        } else if (typeof item.price === 'string') {
          price = parseFloat(item.price);
        } else if (typeof item.amount === 'string') {
          price = parseFloat(item.amount);
        }
        
        // Sayısal değerlerin geçerliliğini kontrol et
        if (isNaN(stock)) stock = 0;
        if (isNaN(price)) price = 0;
        
        product.stock = stock;
        product.price = price;
        
        console.log(`Admin Panel - Processed Product: ID: ${product.id} | Name: ${product.name} | Price: ${price} | Stock: ${stock}`);
        
        // API'dan gelen tarih değerlerini Date nesnesine dönüştür
        product.createdDate = item.createdDate ? new Date(item.createdDate) : new Date();
        product.updatedDate = item.updatedDate ? new Date(item.updatedDate) : new Date();
        
        // Açıklama, marka ve tip bilgilerini ekle
        product.description = item.description || '';
        product.brand = item.brand || '';
        product.type = item.type || '';
        
        // Ürün resimleri varsa ekle
        if (item.productImageFiles && Array.isArray(item.productImageFiles)) {
          product.productImageFiles = item.productImageFiles;
          
          // Resim yolu için API endpoint'ini kullan
          product.imagePath = `https://localhost:7136/api/Products/GetProductImage?id=${product.id}`;
          console.log(`Admin ListComponent: Image path for product ${product.id}: ${product.imagePath}`);
        }
        
        return product;
      }).filter((product: List_Product) => product !== null && product !== undefined);
      
      console.log("ListComponent: Mapped products:", mappedProducts);
      return mappedProducts;
    } catch (error) {
      console.error("ListComponent: Error processing product data:", error);
      return [];
    }
  }

  async loadProductsPage(loadType: LoadType = LoadType.Pagination) {
    this.isLoadingResults = true;
    this.showSpinner(SpinnerType.BallAtom);
    
    try {
      // Paginator'ın mevcut durumunu al
      const pageIndex = this.paginator.pageIndex;
      const pageSize = this.paginator.pageSize;
      
      console.log("ListComponent: Loading products page", { pageIndex, pageSize, loadType });
      
      const allProducts = await this.productService.read(
        pageIndex,
        pageSize,
        () => {
          console.log("ListComponent: Products fetch callback success");
        },
        errorMessage => {
          console.error("ListComponent: Products fetch error callback:", errorMessage);
          this.showError(errorMessage);
        }
      );
      
      if (allProducts) {
        console.log(`ListComponent: Products received with total count ${allProducts.totalProductCount || 0}`);
        this.totalProductCount = allProducts.totalProductCount || 0;
        
        // API'dan gelen ürün verilerini işle
        const processedProducts = this.processProductData(allProducts);
        
        // MatTableDataSource'u güncelle
        this.dataSource.data = processedProducts;
        
        // Pagination için toplam ürün sayısını ayarla
        this.paginator.length = this.totalProductCount;
        
        // Bildirim mesajını sadece ilk yükleme veya yenileme durumunda göster
        if (this.isFirstLoad || loadType === LoadType.FirstLoad || loadType === LoadType.Refresh) {
          this.alertifyService.message("Ürünler başarıyla yüklendi", {
            delay: 3000,
            dismissOthers: true,
            messageType: MessageType.Success,
            position: Position.TopRight
          });
          
          // İlk yükleme flag'ini false yap
          this.isFirstLoad = false;
        }
      } else {
        console.error("ListComponent: Invalid product data received");
        this.showError("Ürün verileri alınamadı");
      }
    } catch (error) {
      console.error("ListComponent: Error in loadProductsPage:", error);
      this.showError("Ürünler yüklenirken bir hata oluştu");
    } finally {
      this.isLoadingResults = false;
      this.hideSpinner(SpinnerType.BallAtom);
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refreshProducts() {
    this.paginator.pageIndex = 0; // İlk sayfaya dön
    this.loadProductsPage(LoadType.Refresh); // Yenileme tipini belirt
  }

  addProductsImage(id: string) {
    this.dialogService.openDialog({
      componentType: SelectProductImageDialogComponent,
      data: id,
      options: {
        width: "1000px",
        height: "600px"
      }
    });
  }

  editProduct(product: List_Product) {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      width: '650px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Ürün güncellemesi başarılı oldu, ürün listesini yenileyelim
        this.loadProductsPage();
        this.alertifyService.message(`${product.name} başarıyla güncellendi`, {
          delay: 3000,
          dismissOthers: true,
          messageType: MessageType.Success,
          position: Position.TopRight
        });
      }
    });
  }

  rowClicked(row: any) {
    // Show product details in a dialog
    console.log("Row clicked:", row);
  }

  showError(message: string) {
    console.error(`Admin ListComponent: ${message}`);
    
    // Test notifications - both Alertify and Toastr services
    this.alertifyService.message(`Admin List - ${message}`, {
      messageType: MessageType.Error,
      position: Position.TopRight,
      delay: 5, 
      dismissOthers: true
    });

    // Also try direct toastr service from window
    try {
      console.log("Testing direct window.alertify call");
      const alertifyInstance = (window as any).alertify;
      if (alertifyInstance) {
        alertifyInstance.error(`Direct Alertify Test: ${message}`);
        console.log("Direct alertify call succeeded");
      } else {
        console.error("window.alertify is not available");
      }
    } catch (e) {
      console.error("Error calling direct alertify:", e);
    }
  }

  async ngOnInit() {
    // Test notifications on component initialization
    this.alertifyService.message("Admin ürün listesi yükleniyor", {
      messageType: MessageType.Notify,
      position: Position.TopRight,
      delay: 3,
      dismissOthers: false
    });
    
    // İlk yüklemede FirstLoad tipini belirt
    await this.loadProductsPage(LoadType.FirstLoad);
  }

  ngAfterViewInit() {
    console.log("ListComponent: ngAfterViewInit start");
    
    // Sort özelliğini ayarla
    this.dataSource.sort = this.sort;
    
    // Özel sıralama fonksiyonunu tanımla
    this.dataSource.sortingDataAccessor = (item: List_Product, property: string) => {
      switch (property) {
        case 'name': return item.name ? item.name.toLowerCase() : '';
        case 'stock': return item.stock;
        case 'price': return item.price;
        case 'createdDate': return new Date(item.createdDate).getTime();
        case 'updatedDate': return new Date(item.updatedDate).getTime();
        default: 
          const value = item[property as keyof List_Product];
          return typeof value === 'string' || typeof value === 'number' ? value : '';
      }
    };
    
    // Arama filtresi için özel fonksiyon
    this.dataSource.filterPredicate = (data: List_Product, filter: string) => {
      const filterValue = filter.trim().toLowerCase();
      return data.name.toLowerCase().includes(filterValue)
        || data.brand.toLowerCase().includes(filterValue)
        || data.type.toLowerCase().includes(filterValue)
        || data.description.toLowerCase().includes(filterValue);
    };
    
    // Pagination ve Sort olaylarını dinle
    // Sort veya sayfa değişiminde yeni verileri yükle
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        tap(() => {
          console.log("ListComponent: Page or sort changed", {
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            sortActive: this.sort.active,
            sortDirection: this.sort.direction
          });
          
          // Sayfa değişikliğinde Pagination tipini belirt
          this.loadProductsPage(LoadType.Pagination);
        })
      )
      .subscribe();
  }
}
