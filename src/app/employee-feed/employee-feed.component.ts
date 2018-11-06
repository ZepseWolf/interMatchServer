import { Component, OnInit } from '@angular/core';
import {WastsonApiService} from '../wastson-api.service'
@Component({
  selector: 'app-employee-feed',
  templateUrl: './employee-feed.component.html',
  styleUrls: ['./employee-feed.component.css']
})
export class EmployeeFeedComponent implements OnInit {

  constructor(private watson: WastsonApiService) { }

  ngOnInit() {
    // this.watson.getTest();
  }

}
