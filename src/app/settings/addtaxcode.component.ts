import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './addtaxcode.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AddTaxCodeComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   loader = false;
   taxcode = "";
   show_in_filter = 0;
   ngOnInit(){
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
   }   
   addTaxCode() {
       if (this.taxcode == '') {
         this.toastr.error('Please enter Tax code.'); 
         return false         
       }
       this.loader = true;
       this.ajaxService.saveTaxCode(this.taxcode, this.show_in_filter ? 1 : 0).subscribe(result => {
        if (result.statusmessage == 1111) {
            this.toastr.error(result.statuscode);
            this.loader = false;          
        }else{
           this.toastr.success('Added successfully.');
           this.loader = false;
           this.router.navigateByUrl('/mantaxcode');
        }
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });        
   }
}
