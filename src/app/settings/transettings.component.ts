import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './transettings.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class TransettingsComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   loader = false;
   settings:any = {
        "company_id": localStorage.getItem("seleCompany"),
        "add_new_data": "0",
        "default_translate": "0",
        "add_location_code": "0",
        "account_code": "",
        "company_code": "",
        "service_url": "",
        "license_key": "",
        "disable_avatax_calc": "0",
        "disable_avatax_comit": "0",
        "enable_avatax_logging": "0",
         "general_settings_id": 0       
     };
   ngOnInit(){
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        this.loader = true;
        this.loadSettings();
   } 
   loadSettings() {
       this.ajaxService.loadSettings().subscribe(result => { 
         if (result.jsondata) {
             var set = JSON.parse(result.jsondata); 
             if (set && set.length) {
                 this.settings = set[0];
             }
         }
         this.loader = false;
       });         
   }
   changeOpt(evnt, sett, attr) {
       sett[attr] = evnt.target.checked ? 1 :0;
   }
   addparent(){
    if ($('input#childcheck').is(':checked')) {
      $('input#parentcheck').prop("checked", true);
    }
   }
   checkchild(){
     if ($('input#parentcheck').is(':checked')) {
       
     }else{
        $('input#childcheck').prop("checked", false);
     }
   }
   saveSettings() {
       this.loader = true;
       this.ajaxService.saveSettings(this.settings).subscribe(result => {
           this.toastr.success('Saved successfully.');
           this.loader = false;
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });        
   }
}
