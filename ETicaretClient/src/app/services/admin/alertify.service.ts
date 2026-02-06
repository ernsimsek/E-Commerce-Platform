import { Injectable } from '@angular/core';
declare var alertify: any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { 
    // Initialize Alertify with default settings
    this.init();
  }

  init() {
    // Set default settings - ensures alertify is properly initialized
    alertify.set('notifier', 'position', 'top-right');
    alertify.set('notifier', 'delay', 3);
    console.log('AlertifyService initialized');
  }

 // message(message: string ,messageType : MessageType ,position : Position, delay: number = 3, dismissOthers: boolean = false )
 message(message: string, options: AlertifyOptions)
 {
    console.log('Alertify message called:', message, options);
    try {
      alertify.set('notifier','delay', options.delay);
      alertify.set('notifier','position', options.position);
      const msj = alertify[options.messageType](message);
      if(options.dismissOthers)
        msj.dismissOthers();
      
      console.log('Alertify message successfully displayed');
      return true;
    } catch (error) {
      console.error('Alertify display error:', error);
      return false;
    }
  }

  dismiss(){
    alertify.dismissAll();
  }
}

export class AlertifyOptions{
  messageType: MessageType = MessageType.Message;
  position: Position = Position.BottomLeft;
  delay: number = 3;
  dismissOthers: boolean = false;
}

export enum MessageType{
  Error = "error",
  Message = "message",
  Notify = "notify",
  Success = "success",
  Warning = "warning"
}

export enum Position{
  TopCenter = "top-center",
  TopRight = "top-right",
  TopLeft = "top-left",
  BottomRight = "bottom-right",
  BottomCenter = "bottom-center",
  BottomLeft = "bottom-left" 
} 