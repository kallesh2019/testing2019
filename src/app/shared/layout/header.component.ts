import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/data.service';
import { LoginService} from 'src/app/login/login.service';

declare var $: any;

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(private router: Router , private dataService:DataService, private ajaxService: LoginService) {}
  displayheader;
  companies = {};
  selectedComp;
  ngOnInit(){
    this.dataService.loginChangeStatus.subscribe(val=>{
      if(val!=null){
        this.displayheader = val;
      }
    })
    this.dataService.dataChangeStatus.subscribe(val=>{
        this.companies = val;
        if (localStorage.getItem("seleCompany")) {
            this.selectedComp = localStorage.getItem("seleCompany");
        }     
    });
   const login = sessionStorage.getItem('currentUser')
   if (login !=null && login !=undefined && login!='' && login!='false'){
    this.displayheader = true;
   }  else{
      this.displayheader = false;
   }
   if (sessionStorage.currentUserId){
     this.LoadCompanies();
     if (localStorage.getItem("seleCompany")) {
        this.selectedComp = localStorage.getItem("seleCompany");
     }      
   }
  }
  logout() {
    this.displayheader = false;
    sessionStorage.currentUser = false;
    localStorage.setItem("userId", null); 
    this.router.navigateByUrl('/login');
  }  
  saveSelComp() {
      localStorage.setItem("seleCompany", this.selectedComp);
      localStorage.setItem("seleCompanyName", $('#usercompany option:selected').text());
      location.reload();
  }
  cancelSelComp() {
     if (localStorage.getItem("seleCompany")) {
        this.selectedComp = localStorage.getItem("seleCompany");
     }
     $('#switchCompany').modal('hide');
  }
  LoadCompanies() {
    this.ajaxService.GetCompaniesByUser(sessionStorage.currentUserId).subscribe(result => {
        this.companies = result;
    });      
  }
}