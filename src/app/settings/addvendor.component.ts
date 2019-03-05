import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './addvendor.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AddVendorComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   costcenters = {};
   itemcode = {};
   totalAjax = 0; 
   loader = false;
   vendor = '';
   vendorcode  = '';
   costcenter = 0;
   item_id = 0;
   excemption = '';
   show_in_filter = 0;
   ngOnInit(){
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        this.loadCostCenter();
        this.loadItemCode();
   }   
   loadCostCenter () {
       this.loader = true;
       this.ajaxService.getCostCenters().subscribe(result => { 
        this.costcenters = result; 
        this.totalAjax = this.totalAjax + 1; 
        this.disableLoader();        
       });       
   } 
   loadItemCode () {
       this.loader = true;
       this.ajaxService.GetItemCodeByCompanyId().subscribe(result => { 
        this.itemcode = result; 
        this.totalAjax = this.totalAjax + 1; 
        this.disableLoader();        
       });       
   }    
   disableLoader(){
       if (this.totalAjax == 2) {
           this.loader = false;
       }
   }
   addvendor() {
       if (this.vendor == '') {
         this.toastr.error('Please enter vendor.'); 
         return false         
       }
       if (this.vendorcode == '') {
         this.toastr.error('Please enter vendor code.'); 
         return false         
       }
      //  if (this.costcenter == 0) {
      //    this.toastr.error('Please select default cost center.'); 
      //    return false         
      //  }
      //  if (this.item_id == 0) {
      //    this.toastr.error('Please select default item code.'); 
      //    return false         
      //  }   
    //    if (this.excemption == '') {
    //      this.toastr.error('Please enter excemption certificate number.'); 
    //      return false         
    //    }       
       this.loader = true;
       this.ajaxService.saveVendor(this.vendor, this.vendorcode, this.costcenter, this.item_id, this.excemption, this.show_in_filter ? 1 : 0).subscribe(result => {
           if ( result.statusmessage == 1111) {
                  this.toastr.error(result.statuscode);
                this.loader = false;
               
              }else{
            //   console.log(result);
               this.toastr.success('Added successfully.');
               this.loader = false;
               this.router.navigateByUrl('/manvendors');
             }
               //  this.toastr.success('Added successfully.');
               // this.loader = false;
               // this.router.navigateByUrl('/manvendors');
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });        
   }
}
