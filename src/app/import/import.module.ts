import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjaxService} from './ajax.service';
import { ImportComponent } from './import.component';
import { HistoryComponent } from './history.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { AuthGuard } from '../auth.guard';


const routes: Routes = [
  {
    path: 'import',
    component: ImportComponent,
    canActivate: [AuthGuard]
  },  
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [AuthGuard]    
  }  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    BrowserModule,
    DropzoneModule
  ],
  declarations: [
    ImportComponent,
    HistoryComponent
  ],
  providers: [
    AjaxService,
    AuthGuard
  ]
})
export class ImportModule {}