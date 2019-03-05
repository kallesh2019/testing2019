import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './manitems.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ManItemsComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   items:any = [];
   taxCodes = {};
   purposes = {};
   totalAjax = 0; 
   editId = null;
   loader = false;
   selectedlineItems = [];
   checkAll = false;
   dup:any;
   Item = null;
   ngOnInit(){
        this.loader = true;
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        this.loadVendors();
        this.loadTaxCode();
        this.loadPurpose();
   }   
   loadVendors() {
       this.ajaxService.getItems().subscribe(result => { 
        this.items = JSON.parse(result.jsondata); 
        this.totalAjax = this.totalAjax + 1; 
        this.disableLoader();   
       if (this.items.length == 0) {
         $("input:checkbox[name=tablecheck]").prop("disabled", true);  
       } 
       });    

   }
   loadTaxCode () {
       this.loader = true;
       this.ajaxService.GetTaxCodeByCompanyId().subscribe(result => { 
        this.taxCodes = result; 
        this.totalAjax = this.totalAjax + 1; 
        this.disableLoader();        
       });       
   } 
   loadPurpose () {
       this.loader = true;
       this.ajaxService.GetPurposeCodesByCompany().subscribe(result => { 
        this.purposes = result; 
        this.totalAjax = this.totalAjax + 1; 
        this.disableLoader();        
       });       
   }   
   disableLoader(){
       if (this.totalAjax == 3) {
           this.loader = false;
       }
   } 
   selectAll () {
       for (var i = 0; i < this.items.length; i++) {
        if (this.checkAll) {
            if (this.selectedlineItems.indexOf(this.items[i].item_id)== -1) {
               this.selectedlineItems.push(this.items[i].item_id);
            }
        } else {
           var index = this.selectedlineItems.indexOf(this.items[i].item_id);
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
       for (var i = 0; i < this.items.length; i++) {
           if (this.selectedlineItems.indexOf(this.items[i].item_id)==-1) {
               return true;
           }           
       }
       this.checkAll = true;       
   }   
   editItem(item) {
       this.dup = $.extend(true, {}, item);
       this.editId = item.item_id
   }
   cancelEdit (i) {
       this.editId = 0;
       this.items[i] = this.dup;
   }
   saveItem(item) {
       if (item.item_code == '') {
         this.toastr.error('Please enter item code.'); 
         return false         
       }
       if (item.item_name == '') {
         this.toastr.error('Please enter item name.'); 
         return false         
       }
    //    if (item.tax_code == 0) {
    //      this.toastr.error('Please select default tax code.'); 
    //      return false         
    //    }
    //    if (item.purpose_id == 0) {
    //      this.toastr.error('Please select default purpose.'); 
    //      return false         
    //    }   
       this.loader = true;
       this.ajaxService.updateItem(item).subscribe(result => {
           this.toastr.success('Upaded successfully.');
           this.loader = false;
           this.selectedlineItems = [];
           this.loadVendors()
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });         
   }
   changeOpt(evnt, vendor) {
       vendor.show_in_filter = evnt.target.checked ? 1 :0;
   }
   deleteBulkModalItem() {
      if (this.selectedlineItems.length == 0) {
      this.toastr.error('Please select one item.');
      return false;
     }
    $('#deleteModalHisBulk').modal('show');
 }
 CancelBulkDelItem(){
    $('#deleteCommentsBulk').val('');
 } 

 okDelBulkItem() {
    if (!$('#deleteCommentsBulk').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delItem(this.selectedlineItems).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loader = false;
        this.selectedlineItems = [];
        this.loadVendors();
        $('#deleteCommentsBulk').val('');
         $('#deleteModalHisBulk').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });        
      $("input:checkbox[name=tablecheck]").prop("checked", "");
} 
   deleteItem(Item) {
    $('#deleteModalHis').modal('show');
    this.Item = Item;
 }
 CancelDelItem(){
    $('#deleteCommentsHis').val('');
 } 

 okDelItem() {
    if (!$('#deleteCommentsHis').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delItem([this.Item.item_id]).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loader = false;
        this.selectedlineItems = [];
        this.loadVendors();
        $('#deleteCommentsHis').val('');
         $('#deleteModalHis').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });       
} 
   delItem(item) {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delItem([item.item_id]).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loader = false;
               this.selectedlineItems = [];
               this.loadVendors();
           }, error => {
               this.loader = false;
               this.toastr.error('Error.');
           }); 
       }           
   }   
   bulkDel() {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delItem(this.selectedlineItems).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loader = false;
               this.selectedlineItems = [];
               this.loadVendors();
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
       this.ajaxService.bulkUpdateItem(show, this.selectedlineItems, this.items).subscribe(result => {
           this.toastr.success('Updated successfully.');
           this.loader = false;
           this.selectedlineItems = [];
           this.loadVendors();
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       }); 
        $("input:checkbox[name=tablecheck]").prop("checked", "");
   }    
}
