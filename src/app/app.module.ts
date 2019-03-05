import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ImportModule } from './import/import.module';
import { RulesModule } from './rules/rules.module';
import { TransactionModule } from './transaction/transaction.module';
import { SettingsModule } from './settings/settings.module';
import { LoginComponent } from './login/login.component';
import { LoginService} from './login/login.service';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { ToastrModule } from 'ngx-toastr';

import {
  FooterComponent,
  HeaderComponent,
  SharedModule
} from './shared';
import { AuthGuard } from 'src/app/auth.guard';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },  
  {
    path: 'import',
    loadChildren: './import/import.module#ImportModule',
    canActivate:[AuthGuard]

  },
  {
    path: 'rules',
    loadChildren: './rules/rules.module#RulesModule'
  },
  {
    path: 'transaction',
    loadChildren: './transaction/transaction.module#TransactionModule'
  },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule'
  }  
], { useHash: true });

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    ImportModule,
    RulesModule,
    rootRouting,
    FormsModule,    
    TransactionModule,
    SettingsModule,
    SharedModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot( { 
        timeOut: 2000,
        positionClass: 'toast-bottom-right'
    }) 
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule {}