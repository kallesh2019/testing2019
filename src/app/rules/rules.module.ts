import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjaxService} from './ajax.service';
import { RulesComponent } from './rules.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: 'rules',
    component: RulesComponent,
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
    RulesComponent    
  ],
  providers: [
    AjaxService,
    AuthGuard
  ]
})
export class RulesModule {}