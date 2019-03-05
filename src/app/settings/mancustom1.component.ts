import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './mancustom1.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ManCustom1Component {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   custom1s:any = [];
   editId = null;
   loader = false;
   selectedlineItems = [];
   checkAll = false;
   dup:any;
   Custom1 = null;
   ngOnInit(){
        this.loader = true;
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        this.loadCustom1s();
   }   
   loadCustom1s() {
       this.ajaxService.getCustom1s().subscribe(result => { 
        this.custom1s = JSON.parse(result.jsondata); 
        this.loader = false; 
          if (this.custom1s.length == 0) {
         $("input:checkbox[name=tablecheck]").prop("disabled", true);;   
       }         
       }); 

           
   }   
   selectAll () {
       for (var i = 0; i < this.custom1s.length; i++) {
        if (this.checkAll) {
            if (this.selectedlineItems.indexOf(this.custom1s[i].custom1_id)== -1) {
               this.selectedlineItems.push(this.custom1s[i].custom1_id);
            }
        } else {
           var index = this.selectedlineItems.indexOf(this.custom1s[i].custom1_id);
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
       for (var i = 0; i < this.custom1s.length; i++) {
           if (this.selectedlineItems.indexOf(this.custom1s[i].custom1_id)==-1) {
               return true;
           }           
       }
       this.checkAll = true;       
   }   
   editCustom1(custom1) {
       this.dup = $.extend(true, {}, custom1);
       this.editId = custom1.custom1_id
   }
   cancelEdit (i) {
       this.editId = 0;
       this.custom1s[i] = this.dup;
   }
   saveCustom1(custom1) {
       if (custom1.custom1 == '') {
         this.toastr.error('Please enter revenue account.'); 
         return false         
       }
       this.loader = true;
       this.ajaxService.updateCustom1(custom1).subscribe(result => {
        if (result.statusmessage == 1111) {
            this.toastr.error(result.statuscode);
            this.loader = false;
          
        }else{
           this.toastr.success('Upaded successfully.');
           this.loadCustom1s();
        }
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });         
   }
   changeOpt(evnt, custom1) {
       custom1.show_in_filter = evnt.target.checked ? 1 :0;
   }
   deleteBulkModalCustom1() {
      if (this.selectedlineItems.length == 0) {
      this.toastr.error('Please select one item.');
      return false;
     }
    $('#deleteModalHisBulk').modal('show');
 }
 CancelBulkDelCustom1(){
    $('#deleteCommentsBulk').val('');
 } 
 okDelBulkCustom1s() {
    if (!$('#deleteCommentsBulk').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delCustom1(this.selectedlineItems).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loadCustom1s();
        this.selectedlineItems = [];
        $('#deleteCommentsBulk').val('');
         $('#deleteModalHisBulk').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });    
     $("input:checkbox[name=tablecheck]").prop("checked", "");   
} 
   deleteCustom1(Custom1) {
    $('#deleteModalHis').modal('show');
    this.Custom1 = Custom1;
 }
 CancelDelCustom1(){
    $('#deleteCommentsHis').val('');
 } 
 okDelCustom1() {
    if (!$('#deleteCommentsHis').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delCustom1([this.Custom1.custom1_id]).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loadCustom1s();
        $('#deleteCommentsHis').val('');
         $('#deleteModalHis').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });        
} 
   delCustom1(custom1) {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delCustom1([custom1.custom1_id]).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loadCustom1s();
           }, error => {
               this.loader = false;
               this.toastr.error('Error.');
           }); 
       }           
   }   
   bulkDel() {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delCustom1(this.selectedlineItems).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loadCustom1s();
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
       this.ajaxService.bulkUpdateCustom1(show, this.selectedlineItems, this.custom1s).subscribe(result => {
           this.toastr.success('Updated successfully.');
           this.loadCustom1s();
           this.selectedlineItems = [];
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       }); 
        $("input:checkbox[name=tablecheck]").prop("checked", "");
   }    
}
