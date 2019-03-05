import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './addpurpose.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AddPurposeComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   enityusecode:any;
   totalAjax = 0; 
   loader = false;
   purpose = '';
   entity = 0;
   show_in_filter = 0;
   ngOnInit(){
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        this.loadEntityUseCode();
   }   
   loadEntityUseCode () {
       this.loader = true;
       this.ajaxService.getEntityUseCode().subscribe(result => { 
        this.enityusecode = JSON.parse(result.usecodeslist); 
        this.totalAjax = this.totalAjax + 1; 
        this.disableLoader();        
       });       
   }  
   disableLoader(){
       if (this.totalAjax == 1) {
           this.loader = false;
       }
   }
   addlocation() {
       if (this.purpose == '') {
         this.toastr.error('Please enter purpose.'); 
         return false         
       }     
    //    if (!this.entity || this.entity == 0) {
    //      this.toastr.error('Please select Entity Use Code.'); 
    //      return false         
    //    }
       this.loader = true;
       this.ajaxService.savePurpose(this.purpose, this.entity, this.show_in_filter ? 1 : 0).subscribe(result => {
           this.toastr.success('Added successfully.');
           this.loader = false;
           this.router.navigateByUrl('/manpurpose');
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });        
   }
}
