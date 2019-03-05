import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './settings.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent {
   constructor(private router: Router, private toastr: ToastrService, private completerService: CompleterService) {} 
   selectedCompName = '';
   ngOnInit(){
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
   }     
}
