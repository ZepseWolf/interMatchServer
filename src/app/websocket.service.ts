import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket;
  
  constructor() { }

  public initSocket(): void {
    this.socket = io();
    console.log('sockeet started');
  } 
  
  public onApproval(): Observable<boolean> {
    // called from the server (waiting for server's emit)
        return new Observable<boolean>(observer => {
            console.log('subscribe');
            this.socket.on('approved', (data: boolean) => {
              console.log('success hell yeah');
              observer.next(data);
            });
        });
    }
    //excuter to approve
    public approval(approve: boolean): void {
        this.socket.emit('approval', approve);
    }
}
