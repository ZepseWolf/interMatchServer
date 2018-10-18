import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs';
import * as _ from 'lodash';


var user  = {
   userName: 'Test-Company<3',
   type: 'company'
}
var query  = [{
  id : 123215435,
  detail: {
  userName: 'Test-Employee1',
  type: 'employee',
  status: 'BLabhh ',
  approve: true,
  },
  
  date: Date.now()
},{
  id : 43523213123,
  detail: {
  userName: 'Test-Employee2',
  type: 'employee',
  status: 'BLabhh sdzxcxcxcxcxc',
  },
  approve: false,
  date: Date.now()
},{
  id : 12323435,
  detail: {
  userName: 'Test-Employee3',
  type: 'employee',
  status: 'BLabhh meow meow',
  },
  approve: false,
  date: Date.now()
}];
@Component({
  selector: 'app-company-feed',
  templateUrl: './company-feed.component.html',
  styleUrls: ['./company-feed.component.css']
})
export class CompanyFeedComponent implements OnInit {
  private feeds$: Object;
  private temp = [] ;
  constructor(private route: ActivatedRoute) { 
    
  }
  observer = {
    next : function(value)  {
      console.log(value);
    },
    error : function(error){
      console.log(error); 
    }
  }
  ngOnInit() {
    
    Observable.create((obs)=>{
      obs.next(
        query.forEach((item, index)=>{
          //get only 10 to prevent too much memory usage
          if (index < 10 ){
            this.temp.push(item);
            console.log(item, index);
          }
        })
      ),2000
    })
    .subscribe(this.feeds$ = this.temp);

  }
  public approval(approve: boolean,id: any ): void {
    // Approval to do ---------------------------------------------------
    
   var t =  _.find(this.temp ,{id: id}, _.map(this.temp,  stateItem => {
    stateItem.approve = approve;
   }));
    console.log(t);
    console.log('Sending to socket service',approve);
    // this.messageContent = null;
  }
}