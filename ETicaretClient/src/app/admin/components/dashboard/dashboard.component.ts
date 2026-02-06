import { Component, OnInit } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SignalRService } from '../../../services/common/signalr.service';
import { ReceiveFunctions } from '../../../constants/receive-functions';
import { HubUrls } from '../../../constants/hub-urls';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../../services/common/models/product.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends BaseComponent implements OnInit {
  apiTestResult: any = null;
  apiTestSuccess: boolean = false;

  // Dashboard statistics
  productCount: number = 0;
  newProducts: number = 0;
  totalSales: number = 0;
  weeklySales: number = 0;
  customerCount: number = 0;
  newCustomers: number = 0;
  pendingOrders: number = 0;
  
  constructor(
    private alertify: AlertifyService, 
    spinner: NgxSpinnerService, 
    private signalRService: SignalRService,
    private httpClient: HttpClient,
    private productService: ProductService
  ) {
    super(spinner);
    signalRService.start(HubUrls.ProductHub);
  }

  async ngOnInit() {
    this.showSpinner(SpinnerType.BallAtom);
    
    try {
      // Initialize SignalR connection for real-time notifications
      this.signalRService.on(ReceiveFunctions.ProductAddedMessageReceiveFunction, message => {
        this.alertify.message(message, { 
          delay: 1000,
          dismissOthers: true,
          messageType: MessageType.Notify,
          position: Position.TopRight
        });
      });
      
      // Fetch dashboard data
      await this.loadDashboardData();
      
      this.hideSpinner(SpinnerType.BallAtom);
    } catch (error) {
      console.error("Dashboard initialization error:", error);
      this.hideSpinner(SpinnerType.BallAtom);
      this.alertify.message("Dashboard yüklenirken bir hata oluştu.", {
        delay: 3000,
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      });
    }
  }
  
  async loadDashboardData() {
    try {
      // Load product statistics
      await this.loadProductStatistics();
      
      // These would normally connect to real API endpoints
      // For now we'll use sample data
      this.totalSales = 24750;
      this.weeklySales = 6250;
      this.customerCount = 125;
      this.newCustomers = 8;
      this.pendingOrders = 12;
      
      console.log("Dashboard data loaded successfully");
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      throw error;
    }
  }
  
  async loadProductStatistics() {
    try {
      const productData = await this.productService.read(0, 100);
      this.productCount = productData.totalProductCount;
      this.newProducts = Math.min(5, Math.floor(this.productCount * 0.1)); // Just a sample calculation
      
      console.log(`Loaded product statistics: ${this.productCount} total products`);
    } catch (error) {
      console.error("Error loading product statistics:", error);
      // Don't throw error here to allow the dashboard to load partial data
      this.alertify.message("Ürün istatistikleri yüklenemedi", {
        delay: 3000,
        dismissOthers: false,
        messageType: MessageType.Warning,
        position: Position.TopRight
      });
    }
  }

  testProductsAPI() {
    this.showSpinner(SpinnerType.BallAtom);
    console.log("Dashboard: Testing Products API...");
    
    this.httpClient.get('https://localhost:7136/api/Products?page=0&size=5')
      .subscribe({
        next: (response) => {
          console.log("Dashboard: Products API test successful:", response);
          this.apiTestResult = response;
          this.apiTestSuccess = true;
          this.hideSpinner(SpinnerType.BallAtom);
          
          this.alertify.message("API bağlantısı başarılı!", {
            delay: 3000,
            dismissOthers: true,
            messageType: MessageType.Success,
            position: Position.TopRight
          });
        },
        error: (error) => {
          console.error("Dashboard: Products API test failed:", error);
          this.apiTestResult = error;
          this.apiTestSuccess = false;
          this.hideSpinner(SpinnerType.BallAtom);
          
          this.alertify.message("API bağlantısı başarısız!", {
            delay: 3000,
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight
          });
        }
      });
  }

  clearAPIResponse() {
    this.apiTestResult = null;
  }
  
  getApiResultText(): string {
    try {
      if (!this.apiTestResult) return '';
      return JSON.stringify(this.apiTestResult, null, 2);
    } catch (error) {
      return 'Sonuç gösterilemiyor: ' + error;
    }
  }
}
