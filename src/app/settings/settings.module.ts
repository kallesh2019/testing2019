import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjaxService} from './ajax.service';
import { MancostcentersComponent } from './mancostcenters.component';
import { AddCostCenterComponent } from './addcostcenter.component';
import { ManpurchaseagentsComponent } from './manpurchaseagents.component';
import { AddPurchaseAgentComponent } from './addpurchaseagent.component';
import { ManRevAccountsComponent } from './manrevaccounts.component';
import { AddRevAccountComponent } from './addrevaccount.component';
import { ManCustom1Component } from './mancustom1.component';
import { AddCustom1Component } from './addcustom1.component';
import { ManCustom2Component } from './mancustom2.component';
import { AddCustom2Component } from './addcustom2.component';
import { ManVendorsComponent } from './manvendors.component';
import { AddVendorComponent } from './addvendor.component';
import { ManItemsComponent } from './manitems.component';
import { AddItemComponent } from './additem.component';
import { ManTaxCodeComponent } from './mantaxcode.component';
import { AddTaxCodeComponent } from './addtaxcode.component';
import { ManLocationsComponent } from './manlocations.component';
import { AddLocationComponent } from './addlocation.component';
import { ManPurposeComponent } from './manpurpose.component';
import { AddPurposeComponent } from './addpurpose.component';
import { SettingsComponent } from './settings.component';
import { TransettingsComponent } from './transettings.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from '../auth.guard';
import { Ng2CompleterModule } from "ng2-completer";
import { FilterPipe} from './filter.pipe';


const routes: Routes = [
  {
    path: 'mancostcenters',
    component: MancostcentersComponent,
    canActivate: [AuthGuard]    
  },
  {
    path: 'addcostcenter',
    component: AddCostCenterComponent,
    canActivate: [AuthGuard]    
  },   
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]    
  },
  {
    path: 'manpurchaseagents',
    component: ManpurchaseagentsComponent,
    canActivate: [AuthGuard]    
  },  
  {
    path: 'addpurchaseagent',
    component: AddPurchaseAgentComponent,
    canActivate: [AuthGuard]    
  },
  {
    path: 'manrevaccounts',
    component: ManRevAccountsComponent,
    canActivate: [AuthGuard]    
  },  
  {
    path: 'addrevaccount',
    component: AddRevAccountComponent,
    canActivate: [AuthGuard]    
  },
  {
    path: 'mancustom1',
    component: ManCustom1Component,
    canActivate: [AuthGuard]    
  },  
  {
    path: 'addcustom1',
    component: AddCustom1Component,
    canActivate: [AuthGuard]    
  },
  {
    path: 'mancustom2',
    component: ManCustom2Component,
    canActivate: [AuthGuard]    
  },  
  {
    path: 'addcustom2',
    component: AddCustom2Component,
    canActivate: [AuthGuard]    
  },
  {
    path: 'manvendors',
    component: ManVendorsComponent,
    canActivate: [AuthGuard]    
  },  
  {
    path: 'addvendor',
    component: AddVendorComponent,
    canActivate: [AuthGuard]    
  },
  {
    path: 'manitems',
    component: ManItemsComponent,
    canActivate: [AuthGuard]    
  },  
  {
    path: 'additem',
    component: AddItemComponent,
    canActivate: [AuthGuard]    
  },
  {
    path: 'mantaxcode',
    component: ManTaxCodeComponent,
    canActivate: [AuthGuard]    
  },  
  {
    path: 'addtaxcode',
    component: AddTaxCodeComponent,
    canActivate: [AuthGuard]    
  },
  {
    path: 'manlocations',
    component: ManLocationsComponent,
    canActivate: [AuthGuard]    
  },  
  {
    path: 'addlocation',
    component: AddLocationComponent,
    canActivate: [AuthGuard]    
  },
  {
    path: 'manpurpose',
    component: ManPurposeComponent,
    canActivate: [AuthGuard]    
  },  
  {
    path: 'addpurpose',
    component: AddPurposeComponent,
    canActivate: [AuthGuard]    
  },
  {
    path: 'transettings',
    component: TransettingsComponent,
    canActivate: [AuthGuard]    
  }   
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    Ng2CompleterModule,
    BrowserModule
  ],
  declarations: [
    MancostcentersComponent,
    SettingsComponent,
    AddCostCenterComponent,
    ManpurchaseagentsComponent,
    AddPurchaseAgentComponent,
    ManRevAccountsComponent,
    AddRevAccountComponent,
    ManCustom1Component,
    AddCustom1Component,
    ManCustom2Component,
    AddCustom2Component,
    ManVendorsComponent,
    AddVendorComponent,
    ManItemsComponent,
    AddItemComponent,
    ManTaxCodeComponent,
    AddTaxCodeComponent,
    ManLocationsComponent,
    AddLocationComponent,
    ManPurposeComponent,
    AddPurposeComponent,
    TransettingsComponent,
    FilterPipe
  ],
  providers: [
    AjaxService,
    AuthGuard
  ]
})
export class SettingsModule {}