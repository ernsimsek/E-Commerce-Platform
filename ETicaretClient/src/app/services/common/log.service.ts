import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private debugEnabled = !environment.production;

  constructor() {
    console.log(`LogService: Debug logging is ${this.debugEnabled ? 'enabled' : 'disabled'}`);
  }

  debug(source: string, message: string, data?: any): void {
    if (this.debugEnabled) {
      if (data !== undefined) {
        console.log(`[DEBUG] ${source}: ${message}`, this.sanitizeData(data));
      } else {
        console.log(`[DEBUG] ${source}: ${message}`);
      }
    }
  }

  info(source: string, message: string, data?: any): void {
    if (data !== undefined) {
      console.info(`[INFO] ${source}: ${message}`, this.sanitizeData(data));
    } else {
      console.info(`[INFO] ${source}: ${message}`);
    }
  }

  warn(source: string, message: string, data?: any): void {
    if (data !== undefined) {
      console.warn(`[WARN] ${source}: ${message}`, this.sanitizeData(data));
    } else {
      console.warn(`[WARN] ${source}: ${message}`);
    }
  }

  error(source: string, message: string, error?: any): void {
    if (error !== undefined) {
      console.error(`[ERROR] ${source}: ${message}`, error);
    } else {
      console.error(`[ERROR] ${source}: ${message}`);
    }
  }

  // Hassas verileri temizleyen yardımcı metod
  private sanitizeData(data: any): any {
    if (!data) return data;
    
    // Derin kopya oluştur
    const sanitized = JSON.parse(JSON.stringify(data));
    
    // Hassas alanları maske
    this.maskSensitiveFields(sanitized);
    
    return sanitized;
  }

  private maskSensitiveFields(obj: any): void {
    if (!obj || typeof obj !== 'object') return;
    
    const sensitiveKeys = ['password', 'token', 'secret', 'authorization', 'apiKey'];
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Hassas alanları maske
        if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
          if (typeof obj[key] === 'string') {
            obj[key] = '***MASKED***';
          }
        } 
        // Alt nesneler için işlemi tekrarla
        else if (typeof obj[key] === 'object') {
          this.maskSensitiveFields(obj[key]);
        }
      }
    }
  }
} 