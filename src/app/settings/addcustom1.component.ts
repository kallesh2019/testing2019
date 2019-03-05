import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './addcustom1.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AddCustom1Component {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   loader = false;
   custom1 = "";
   show_in_filter = 0;
   ngOnInit(){
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
   }   
   addCustom1() {
       if (this.custom1 == '') {
         this.toastr.error('Please enter custom1.'); 
         return false         
       }
       this.loader = true;
       this.ajaxService.saveCustom1(this.custom1, this.show_in_filter ? 1 : 0).subscribe(result => {
        if (result.statusmessage == 1111) {
            this.toastr.error(result.statuscode);
            this.loader = false;
          
        }else{
           this.toastr.success('Added successfully.');
           this.loader = false;
           this.router.navigateByUrl('/mancustom1');
        }
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });        
   }
}
