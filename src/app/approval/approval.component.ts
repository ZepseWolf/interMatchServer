import { Component, OnInit } from '@angular/core';
import { WebsocketService} from '../websocket.service';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {

  constructor(private ws: WebsocketService) { }

  ngOnInit():void {
    this.initIoConnection();
  }
  private initIoConnection(): void{
    this.ws.initSocket();

    this.ws.onApproval()
        .subscribe((approve: boolean) => {
          //asyn function to wait for message sent before displaying this.Hence the subscribe
          // this.approve = approve ;
          console.log("Application has been ", approve);
        });

  }
  public approval(approve: boolean): void {
    // Approval to do ---------------------------------------------------

    this.ws.approval(approve);
    console.log('Sending to socket service',approve);
    // this.messageContent = null;
  }

}
