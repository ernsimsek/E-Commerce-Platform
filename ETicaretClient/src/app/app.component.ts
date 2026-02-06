import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
import { AuthService } from './services/common/auth.service';
import { Router, NavigationEnd, Event } from '@angular/router';
import { HttpClientService } from './services/common/http-client.service';
import { filter } from 'rxjs/operators';

declare var $: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isAdminRoute: boolean = false;

  constructor(public authService: AuthService, 
              private toastrService: CustomToastrService, 
              private router: Router, 
              private httpClientService: HttpClientService) {
    
    // Router event'lerini dinleyerek admin route'larını tespit edelim
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // URL /admin ile başlıyorsa admin panelindeyiz demektir
        this.isAdminRoute = event.url.startsWith('/admin');
        console.log(`Route changed: ${event.url}, isAdmin: ${this.isAdminRoute}`);
      });
  }

  ngOnInit(): void {
    this.authService.identityCheck();
    console.log("Application initialized, auth check completed.");
  }

  signOut() {
    localStorage.removeItem('accessToken');
    this.authService.identityCheck();
    this.router.navigate([""]);
    this.toastrService.message('Oturum kapatılmıştır!', 'Oturum Kapatıldı', {
      messageType: ToastrMessageType.Warning,
      position: ToastrPosition.TopRight
    });
  }
}




