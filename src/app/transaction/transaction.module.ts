import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjaxService} from './ajax.service';
import { TransactionComponent } from './transaction.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import {NgxPaginationModule} from 'ngx-pagination';
import { AuthGuard } from '../auth.guard';
import { Ng2CompleterModule } from "ng2-completer";


const routes: Routes = [
  {
    path: 'transaction',
    component: TransactionComponent,
    canActivate: [AuthGuard]    
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    BrowserModule,
    DropzoneModule,
    NgxPaginationModule,
    Ng2CompleterModule
  ],
  declarations: [
    TransactionComponent    
  ],
  providers: [
    AjaxService,
    AuthGuard
  ]
})
export class TransactionModule {}