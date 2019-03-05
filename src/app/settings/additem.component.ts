import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './additem.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AddItemComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   taxCodes = {};
   purposes = {};
   totalAjax = 0; 
   loader = false;
   itemcode = '';
   itemname  = '';
   tax_code = 0;
   purpose = 0;
   show_in_filter = 0;
   ngOnInit(){
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        this.loadTaxCode();
        this.loadPurpose();
   }   
   loadTaxCode () {
       this.loader = true;
       this.ajaxService.GetTaxCodeByCompanyId().subscribe(result => { 
        this.taxCodes = result; 
        this.totalAjax = this.totalAjax + 1; 
        this.disableLoader();        
       });       
   } 
   loadPurpose () {
       this.loader = true;
       this.ajaxService.GetPurposeCodesByCompany().subscribe(result => { 
        this.purposes = result; 
        this.totalAjax = this.totalAjax + 1; 
        this.disableLoader();        
       });       
   }    
   disableLoader(){
       if (this.totalAjax == 2) {
           this.loader = false;
       }
   }
   additem() {
       if (this.itemcode == '') {
         this.toastr.error('Please enter item code.'); 
         return false         
       }
       if (this.itemname == '') {
         this.toastr.error('Please enter item name.'); 
         return false         
       }
    //    if (this.tax_code == 0) {
    //      this.toastr.error('Please select default tax code.'); 
    //      return false         
    //    }
    //    if (this.purpose == 0) {
    //      this.toastr.error('Please select default purpose.'); 
    //      return false         
    //    }   
  
       this.loader = true;
       this.ajaxService.saveItem(this.itemcode, this.itemname, this.tax_code, this.purpose, this.show_in_filter ? 1 : 0).subscribe(result => {
           this.toastr.success('Added successfully.');
           this.loader = false;
           this.router.navigateByUrl('/manitems');
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });        
   }
}
