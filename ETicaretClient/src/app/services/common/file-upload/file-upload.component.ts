import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { HttpClientService } from '../http-client.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AlertifyService, MessageType, Position } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadDialogComponent } from 'src/app/dialogs/file-upload-dialog/file-upload-dialog.component';
import { DialogService } from '../dialog.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../../base/base.component';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

export enum FileUploadDialogState {
  Yes = 1,
  No = 2,
  Close = 3,
  Success = 4,
  Error = 5
}

@Component({
  selector: 'app-file-upload',
  standalone: false,
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent implements OnInit {
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private customToastrService: CustomToastrService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService,
    private router: Router) {}
  
  public files: NgxFileDropEntry[] = [];
  errorMessages: string[] = [];

  @Input() options: Partial<FileUploadOptions> = {};
  @Output() uploadComplete = new EventEmitter();

  ngOnInit(): void {
    // Component initialization logic
  }

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    
    // Token kontrolü yap
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("FileUpload: Token bulunamadı!");
      this.showErrorMessage("Yetkilendirme hatası. Lütfen tekrar giriş yapın.");
      
      // Kullanıcıyı login sayfasına yönlendir
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      
      return;
    }
    
    // Dosya validasyonu
    if (files.length === 0) {
      this.showErrorMessage("Lütfen en az bir dosya seçin.");
      return;
    }
    
    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: FileUploadDialogState.Yes, 
      afterClosed: () => {
        this.uploadFiles(files, token);
      }
    });
  }
  
  private uploadFiles(files: NgxFileDropEntry[], token: string) {
    this.spinner.show(SpinnerType.BallAtom);
    console.log("FileUpload: Dosya yükleme başlatılıyor...");
    
    const fileData: File[] = [];
    for (const selectedFile of files) {
      const fileEntry = selectedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((_file: File) => {
        fileData.push(_file);
      });
    }

    if (fileData.length === 0) {
      this.spinner.hide(SpinnerType.BallAtom);
      this.showErrorMessage("Dosya yükleme başarısız. Lütfen dosya seçtiğinizden emin olun.");
      return;
    }

    const observable: Observable<FileUploadDialogState> = this.afterUpload();

    setTimeout(() => {
      if (this.options.accept && !this.validateFiles(fileData)) {
        this.spinner.hide(SpinnerType.BallAtom);
        return;
      }

      const formData = new FormData();
      
      // Doğru Id format kontrolü
      if (this.options.id) {
        const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!guidRegex.test(this.options.id)) {
          console.error('Geçersiz GUID formatı:', this.options.id);
          this.spinner.hide(SpinnerType.BallAtom);
          this.showErrorMessage("Geçersiz ürün ID formatı.");
          return;
        }
      }
      
      // Create a properly formatted query string with capital "Id"
      const queryString = this.options.id ? `Id=${this.options.id}` : this.options?.queryString || '';
      console.log('Using query string with correct case:', queryString);
      
      // Use "Files" key as expected by the backend
      fileData.forEach((file) => {
        formData.append("Files", file, file.name);
      });
      
      // Debugging logs
      console.log('FormData file count:', fileData.length);
      if (fileData.length > 0) {
        console.log('First file name:', fileData[0].name);
      }
      
      // Headers oluştur
      let headers = new HttpHeaders();
      headers = headers.append("Authorization", `Bearer ${token}`);
      
      // API isteğini gönder
      this.httpClientService.post({
        controller: this.options.controller,
        action: this.options.action,
        queryString: queryString,
        headers: headers
      }, formData).subscribe({
        next: (response) => {
          console.log("FileUpload: Dosya yükleme başarılı", response);
          this.spinner.hide(SpinnerType.BallAtom);
          this.showSuccessMessage("Dosyalar başarıyla yüklenmiştir.");
          this.uploadComplete.emit();
        },
        error: (error: HttpErrorResponse) => {
          console.error("FileUpload: Dosya yükleme hatası", error);
          this.spinner.hide(SpinnerType.BallAtom);
          
          let errorMessage = "Dosyalar yüklenirken bir hata oluştu.";
          
          if (error.error && typeof error.error === 'object') {
            console.error("FileUpload: Hata detayları:", error.error);
            
            if (error.error.errors) {
              const errorDetails = Object.values(error.error.errors).flat();
              if (errorDetails.length > 0) {
                errorMessage = Array.isArray(errorDetails) 
                  ? errorDetails.join(', ') 
                  : String(errorDetails);
              }
            }
          }
          
          this.showErrorMessage(errorMessage);
          
          if (error.status === 401) {
            localStorage.removeItem("accessToken");
            this.router.navigate(['/login']);
          }
        }
      });
    }, 0);
  }
  
  private showSuccessMessage(message: string) {
    if (this.options.isAdminPage) {
      this.alertifyService.message(message, {
        delay: 3000,
        dismissOthers: true,
        messageType: MessageType.Success,
        position: Position.TopRight,
      });
    } else {
      this.customToastrService.message(message, "Başarılı", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
    }
  }
  
  private showErrorMessage(message: string) {
    if (this.options.isAdminPage) {
      this.alertifyService.message(message, {
        delay: 3000,
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight,
      });
    } else {
      this.customToastrService.message(message, "Hata", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
    }
  }

  private afterUpload(): Observable<FileUploadDialogState> {
    return of(FileUploadDialogState.Success);
  }

  private validateFiles(files: File[]): boolean {
    if (!this.options.accept)
      return true;

    for (const file of files) {
      const ext = file.name.split('.').pop();
      if (!ext || !this.options.accept.includes(`.${ext.toLowerCase()}`)) {
        this.errorMessages = [`Yalnızca ${this.options.accept} uzantılı dosyalar kabul edilmektedir.`];
        return false;
      }
    }
    return true;
  }
}

export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  isAdminPage?: boolean = false;
  responseType?: string;
  id?: string;
}
