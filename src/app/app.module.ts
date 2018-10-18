import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ApprovalComponent } from './approval/approval.component';
import { CompanyFeedComponent } from './company-feed/company-feed.component';
import { EmployeeFeedComponent } from './employee-feed/employee-feed.component';
import { RouterModule, Routes} from '@angular/router';
const routes: Routes=[
  {path: 'company', component: CompanyFeedComponent},
  {path: 'employee', component: EmployeeFeedComponent},
  {path: '', redirectTo: 'company', pathMatch:'full'}
];
@NgModule({
  declarations: [
    AppComponent,
    ApprovalComponent,
    CompanyFeedComponent,
    EmployeeFeedComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
