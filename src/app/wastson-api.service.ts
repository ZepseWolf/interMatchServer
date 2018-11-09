import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
// const _ = require('lodash');
// var personalityInsights = new PersonalityInsightsV3({
//   version: '2017-10-13',
//   username: 'e017ffe0-0eec-40b1-9cbc-5f22de364688',
//   password: 'vGT2DJsQA3Op',
//   url: 'https://gateway.watsonplatform.net/personality-insights/api'
// });


@Injectable({
  providedIn: 'root'
})
export class WastsonApiService {
  
  constructor(private http: HttpClient) { }
  
 
  //  private profileParams = {
  //   // Get the content from the JSON file.
  //   content: this.http.get('https://jsonplaceholder.typicode.com/users'),
  //   'content_type': 'application/json',
  //   'consumption_preferences': true,
  //   'raw_scores': true
  // };
  // getTest(){
  //   console.log(this.profileParams.content);
  // }

  //How to POST
  // save( user: User ):Observable<User>{
  //   return this.http.post('http://localhost:3000/register',user,{
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })
  //   })
  //   .pipe();
  // }
  // How to get 
  // getProfile(id){
  //   this.http.get(`/login/:${id}`)
  //   .subscribe((data:any)=>{
  //     if (data.num_of_login > 1){

  //     }
  //   })
  // }
  
}
