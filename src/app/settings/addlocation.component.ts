import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './addlocation.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AddLocationComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   costcenters = {};
   purposes = {};
   totalAjax = 0; 
   loader = false;
   locationcode = '';
   address  = '';
   city = '';
   region = '';
   postalcode = '';
   country = '';
   costcenter = 0;
   purpose = 0;
   show_in_filter = 0;
   ngOnInit(){
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        this.loadCostCenter();
        this.loadPurpose();
   }   
   loadCostCenter () {
       this.loader = true;
       this.ajaxService.getCostCenters().subscribe(result => { 
        this.costcenters = result; 
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
   addlocation() {
       if (this.locationcode == '') {
         this.toastr.error('Please enter location code.'); 
         return false         
       }
       if (this.address == '') {
         this.toastr.error('Please enter address.'); 
         return false         
       }  
       if (this.city == '') {
         this.toastr.error('Please enter city.'); 
         return false         
       }
       if (this.country == '') {
         this.toastr.error('Please enter country.'); 
         return false         
       }       
    //    if (this.costcenter == 0) {
    //      this.toastr.error('Please select default cost center.'); 
    //      return false         
    //    }
    //    if (this.purpose == 0) {
    //      this.toastr.error('Please select default purpose.'); 
    //      return false         
    //    }   
  
       this.loader = true;
       this.ajaxService.saveLocation(this.locationcode, this.address, this.city, this.region, this.postalcode, this.country, this.costcenter, this.purpose, this.show_in_filter ? 1 : 0).subscribe(result => {
           this.toastr.success('Added successfully.');
           this.loader = false;
           this.router.navigateByUrl('/manlocations');
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });        
   }
}
