import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './addcostcenter.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AddCostCenterComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   purpose = {};
   itemcode = {};
   message = {};
   totalAjax = 0; 
   loader = false;
   costcenter = "";
   item_id = 0;
   purpose_id = 0;
   show_in_filter = 0;
   ngOnInit(){
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        this.loadPurpose();
        this.loadItemCode();
   }   
   loadPurpose () {
       this.loader = true;
       this.ajaxService.GetPurposeCodesByCompany().subscribe(result => { 
        this.purpose = result; 
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
   addcostcenter() {
       if (this.costcenter == '') {
         this.toastr.error('Please enter cost center.'); 
         return false         
       }
    //    if (this.purpose_id == 0) {
    //      this.toastr.error('Please select default purpose code.'); 
    //      return false         
    //    }
    //    if (this.item_id == 0) {
    //      this.toastr.error('Please select item code.'); 
    //      return false         
    //    }
       this.loader = true;
       this.ajaxService.saveCostCenter(this.costcenter, this.purpose_id, this.item_id, this.show_in_filter ? 1 : 0).subscribe(result => {
            if (result.statusmessage == 1111) {
                 this.toastr.error(result.statuscode);
                 this.loader = false;
               
             }else{
                this.toastr.success('Added successfully.');
                 this.loader = false; 
                this.router.navigateByUrl('/mancostcenters');
              }
        }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });        
   }
}
