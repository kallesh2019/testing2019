import { Component, ViewChild  } from '@angular/core';
import { LoginService} from './login.service';
import { Router } from '@angular/router';
import { DropzoneModule ,DropzoneComponent , DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../shared/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username;
  password;
  error = false;
  loader = false;
   constructor(private ajaxService: LoginService, private router: Router  ,private toastr: ToastrService, private dataService: DataService) {}  
   @ViewChild(DropzoneDirective) directiveRef?: DropzoneDirective;  
   ngOnInit(){
   }
   checkCompanyExists (seleCompany, result) {
       var ret = false;
       for (var i = 0; i < result.companylist.length; i++) {
          if (result.companylist[i].companyid == seleCompany) {
              ret =true;
          };
       }
       return ret;
   }
   loginUser() {
      this.loader = true;
      this.ajaxService.login(this.username, this.password).subscribe(result => { 
        if(result.statuscode == 0) {
            localStorage.setItem("userId", result.userid.toString()); 
            sessionStorage.currentUserId = result.userid;
            sessionStorage.currentUser = true;
            this.ajaxService.GetCompaniesByUser(result.userid).subscribe(result => {
                if (result.companylist.length > 0) {
                    if (!localStorage.getItem("seleCompany") || !this.checkCompanyExists(localStorage.getItem("seleCompany"), result))
                    {
                        localStorage.setItem("seleCompany", result.companylist[0].companyid);
                        localStorage.setItem("seleCompanyName", result.companylist[0].companyname);
                    }
                    this.dataService.loginStatus(true);                                
                    this.dataService.companyData(result);                                        
                    this.router.navigateByUrl('/import');
                } else {
                    this.toastr.error('User dont have valid company information. Please contact administrator.');
                    this.loader = false;
                    sessionStorage.currentUser = false;
                    this.router.navigateByUrl('/login');
                }
            });

        } else {
            this.loader = false;
            this.error = true;
        }
      },
      error => {
          this.loader = false;
      });
   }   
}