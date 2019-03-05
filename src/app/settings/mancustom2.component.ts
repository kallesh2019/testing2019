import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './mancustom2.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ManCustom2Component {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   custom2s:any = [];
   editId = null;
   loader = false;
   selectedlineItems = [];
   checkAll = false;
   dup:any;
   Custom2 = null;
   ngOnInit(){
        this.loader = true;
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        this.loadCustom2s();
   }   
   loadCustom2s() {
       this.ajaxService.getCustom2s().subscribe(result => { 
        this.custom2s = JSON.parse(result.jsondata); 
        this.loader = false;
            if (this.custom2s.length == 0) {
         $("input:checkbox[name=tablecheck]").prop("disabled", true);;   
       }            
       });    
          
   }   
   selectAll () {
       for (var i = 0; i < this.custom2s.length; i++) {
        if (this.checkAll) {
            if (this.selectedlineItems.indexOf(this.custom2s[i].custom2_id)== -1) {
               this.selectedlineItems.push(this.custom2s[i].custom2_id);
            }
        } else {
           var index = this.selectedlineItems.indexOf(this.custom2s[i].custom2_id);
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
       for (var i = 0; i < this.custom2s.length; i++) {
           if (this.selectedlineItems.indexOf(this.custom2s[i].custom2_id)==-1) {
               return true;
           }           
       }
       this.checkAll = true;       
   }   
   editCustom2(custom2) {
       this.dup = $.extend(true, {}, custom2);
       this.editId = custom2.custom2_id
   }
   cancelEdit (i) {
       this.editId = 0;
       this.custom2s[i] = this.dup;
   }
   saveCustom2(custom2) {
       if (custom2.custom2 == '') {
         this.toastr.error('Please enter revenue account.'); 
         return false         
       }
       this.loader = true;
       this.ajaxService.updateCustom2(custom2).subscribe(result => {
        if (result.statusmessage == 1111) {
            this.toastr.error(result.statuscode);
            this.loader = false;
          
        }else{
           this.toastr.success('Upaded successfully.');
           this.loadCustom2s();
        }
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });         
   }
   changeOpt(evnt, custom2) {
       custom2.show_in_filter = evnt.target.checked ? 1 :0;
   }
   deleteBulkModalCustom2() {
      if (this.selectedlineItems.length == 0) {
      this.toastr.error('Please select one item.');
      return false;
     }
    $('#deleteModalHisBulk').modal('show');
 }
 CancelBulkDelCustom2(){
    $('#deleteCommentsBulk').val('');
 } 

 okDelBulkCustom2s() {
    if (!$('#deleteCommentsBulk').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delCustom2(this.selectedlineItems).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loadCustom2s();
        this.selectedlineItems = [];
        $('#deleteCommentsBulk').val('');
         $('#deleteModalHisBulk').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });       
     $("input:checkbox[name=tablecheck]").prop("checked", ""); 
} 
   deleteCustom2(Custom2) {
    $('#deleteModalHis').modal('show');
    this.Custom2 = Custom2;
 }
 CancelDelCustom2(){
    $('#deleteCommentsHis').val('');
 } 

 okDelCustom2() {
    if (!$('#deleteCommentsHis').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delCustom2([this.Custom2.custom2_id]).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loadCustom2s();
        $('#deleteCommentsHis').val('');
         $('#deleteModalHis').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });        
} 

   delCustom2(custom2) {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delCustom2([custom2.custom2_id]).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loadCustom2s();
           }, error => {
               this.loader = false;
               this.toastr.error('Error.');
           }); 
       }           
   }   
   bulkDel() {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delCustom2(this.selectedlineItems).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loadCustom2s();
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
       this.ajaxService.bulkUpdateCustom2(show, this.selectedlineItems, this.custom2s).subscribe(result => {
           this.toastr.success('Updated successfully.');
           this.loadCustom2s();
           this.selectedlineItems = [];
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       }); 
        $("input:checkbox[name=tablecheck]").prop("checked", "");
   }    
}
