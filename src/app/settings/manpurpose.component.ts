import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './manpurpose.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ManPurposeComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   purposes:any = [];
   enityusecode:any;
   totalAjax = 0; 
   editId = null;
   loader = false;
   selectedlineItems = [];
   checkAll = false;
   dup:any;
   Purpose = null;
   ngOnInit(){
        this.loader = true;
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        this.loadPurpose();
        this.loadEntityUseCode();
   }   
   loadPurpose() {
       this.ajaxService.getPurpose().subscribe(result => { 
        this.purposes = JSON.parse(result.jsondata); 
        this.totalAjax = this.totalAjax + 1; 
        this.disableLoader(); 
       if (this.purposes.length == 0) {
         $("input:checkbox[name=tablecheck]").prop("disabled", true);;   
       }        
       });

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
       if (this.totalAjax == 2) {
           this.loader = false;
       }
   } 
   selectAll () {
       for (var i = 0; i < this.purposes.length; i++) {
        if (this.checkAll) {
            if (this.selectedlineItems.indexOf(this.purposes[i].purpose_id)== -1) {
               this.selectedlineItems.push(this.purposes[i].purpose_id);
            }
        } else {
           var index = this.selectedlineItems.indexOf(this.purposes[i].purpose_id);
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
       for (var i = 0; i < this.purposes.length; i++) {
           if (this.selectedlineItems.indexOf(this.purposes[i].purpose_id)==-1) {
               return true;
           }           
       }
       this.checkAll = true;       
   }   
   editPur(purpose) {
       this.dup = $.extend(true, {}, purpose);
       this.editId = purpose.purpose_id
   }
   cancelEdit (i) {
       this.editId = 0;
       this.purposes[i] = this.dup;
   }
   savePur(purpose) {
       if (!purpose.entity_use_code || purpose.entity_use_code == "") {
        //  this.toastr.error('Please select the entity_use_code.'); 
        //  return false  
            purpose.entity_use_code = 0;       
       }
       this.loader = true;
       this.ajaxService.updatePur(purpose).subscribe(result => {
           this.toastr.success('Upaded successfully.');
           this.loader = false;
           this.selectedlineItems = [];
           this.loadPurpose()
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });         
   }
   changeOpt(evnt, purpose) {
       purpose.show_in_filter = evnt.target.checked ? 1 :0;
   }

   deleteBulkModalPurpose() {
      if (this.selectedlineItems.length == 0) {
      this.toastr.error('Please select one item.');
      return false;
     }
    $('#deleteModalHisBulk').modal('show');
 }
 CancelBulkDelPurpose(){
    $('#deleteCommentsBulk').val('');
 } 
 okDelBulkPurpose() {
    if (!$('#deleteCommentsBulk').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delPur(this.selectedlineItems).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loader = false;
        this.selectedlineItems = [];
        this.loadPurpose();
        $('#deleteCommentsBulk').val('');
         $('#deleteModalHisBulk').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });
     $("input:checkbox[name=tablecheck]").prop("checked", "");        
} 
   deletePurpose(Purpose) {
    $('#deleteModalHis').modal('show');
    this.Purpose = Purpose;
 }
 CancelDelPurpose(){
    $('#deleteCommentsHis').val('');
 } 

 okDelPurpose() {
    if (!$('#deleteCommentsHis').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delPur([this.Purpose.purpose_id]).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loader = false;
        this.selectedlineItems = [];
        this.loadPurpose();
        $('#deleteCommentsHis').val('');
         $('#deleteModalHis').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });        
} 
   delPur(purpose) {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delPur([purpose.purpose_id]).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loader = false;
               this.selectedlineItems = [];
               this.loadPurpose();
           }, error => {
               this.loader = false;
               this.toastr.error('Error.');
           }); 
       }           
   }   
   bulkDel() {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delPur(this.selectedlineItems).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loader = false;
               this.selectedlineItems = [];
               this.loadPurpose();
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
       this.ajaxService.bulkUpdatePur(show, this.selectedlineItems, this.purposes).subscribe(result => {
           this.toastr.success('Updated successfully.');
           this.loader = false;
           this.selectedlineItems = [];
           this.loadPurpose();
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       }); 
        $("input:checkbox[name=tablecheck]").prop("checked", "");
   }    
}
