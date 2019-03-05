import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './manrevaccounts.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ManRevAccountsComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   revAccounts:any = [];
   editId = null;
   loader = false;
   selectedlineItems = [];
   checkAll = false;
   dup:any;
   Account = null;
   ngOnInit(){
        this.loader = true;
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        this.loadRevAccounts();
   }   
   loadRevAccounts() {
       this.ajaxService.getRevAccounts().subscribe(result => { 
        this.revAccounts = JSON.parse(result.jsondata); 
        this.loader = false;  
        if (this.revAccounts.length == 0) {
         $("input:checkbox[name=tablecheck]").prop("disabled", true);;   
       }        
       });       

   }   
   selectAll () {
       for (var i = 0; i < this.revAccounts.length; i++) {
        if (this.checkAll) {
            if (this.selectedlineItems.indexOf(this.revAccounts[i].revenue_account_id)== -1) {
               this.selectedlineItems.push(this.revAccounts[i].revenue_account_id);
            }
        } else {
           var index = this.selectedlineItems.indexOf(this.revAccounts[i].revenue_account_id);
           if (index !== -1) this.selectedlineItems.splice(index, 1);                       
        }
       }
   } 
   selectItem(id) {
       if (this.selectedlineItems.indexOf(id)==-1) {
          this.selectedlineItems.push(id);
       }  else {
           var index = this.selectedlineItems.indexOf(id);
           if (index !== -1) this.selectedlineItems.splice(index, 1);           
       }
       this.selectAllButton();
   } 
   selectAllButton () {
       this.checkAll = false;
       for (var i = 0; i < this.revAccounts.length; i++) {
           if (this.selectedlineItems.indexOf(this.revAccounts[i].revenue_account_id)==-1) {
               return true;
           }           
       }
       this.checkAll = true;       
   }   
   editRevAccount(account) {
       this.dup = $.extend(true, {}, account);
       this.editId = account.revenue_account_id
   }
   cancelEdit (i) {
       this.editId = 0;
       this.revAccounts[i] = this.dup;
   }
   saveRevAccount(account) {
       if (account.revenue_account == '') {
         this.toastr.error('Please enter revenue account.'); 
         return false         
       }
       this.loader = true;
       this.ajaxService.updateRevAccount(account).subscribe(result => {
        if (result.statusmessage == 1111) {
            this.toastr.error(result.statuscode);
            this.loader = false;
          
        }else{
           this.toastr.success('Upaded successfully.');
           this.loadRevAccounts();
        }
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });         
   }
   changeOpt(evnt, account) {
       account.show_in_filter = evnt.target.checked ? 1 :0;
   }
   deleteBulkModalRevAccount() {
      if (this.selectedlineItems.length == 0) {
      this.toastr.error('Please select one item.');
      return false;
     }
    $('#deleteModalHisBulk').modal('show');
 }
 CancelBulkDelRevAccount(){
    $('#deleteCommentsBulk').val('');
 } 

 okDelBulkRevAccounts() {
    if (!$('#deleteCommentsBulk').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delRevAccount(this.selectedlineItems).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loadRevAccounts();
        this.selectedlineItems = [];
        $('#deleteCommentsBulk').val('');
         $('#deleteModalHisBulk').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });    
     $("input:checkbox[name=tablecheck]").prop("checked", "");    
} 
   deleteRevAccount(Account) {
    $('#deleteModalHis').modal('show');
    this.Account = Account;
 }
 CancelDelRevAccount(){
    $('#deleteCommentsHis').val('');
 } 

 okDelRevAccount() {
    if (!$('#deleteCommentsHis').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delRevAccount([this.Account.revenue_account_id]).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loadRevAccounts();
        $('#deleteCommentsHis').val('');
         $('#deleteModalHis').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });        
} 
   delRevAccount(account) {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delRevAccount([account.revenue_account_id]).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loadRevAccounts();
           }, error => {
               this.loader = false;
               this.toastr.error('Error.');
           }); 
       }           
   }   
   bulkDel() {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delRevAccount(this.selectedlineItems).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loadRevAccounts();
               this.selectedlineItems = [];
           }, error => {
               this.loader = false;
               this.toastr.error('Error.');
           }); 
       }        
   }
   showinList(show) {
      if (this.selectedlineItems.length == 0) {
      this.toastr.error('Please select one item.');
      return false;
     }
       this.loader = true;
       this.ajaxService.bulkUpdateRevAccount(show, this.selectedlineItems, this.revAccounts).subscribe(result => {
           this.toastr.success('Updated successfully.');
           this.loadRevAccounts();
           this.selectedlineItems = [];
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       }); 
        $("input:checkbox[name=tablecheck]").prop("checked", "");
   }    
}
