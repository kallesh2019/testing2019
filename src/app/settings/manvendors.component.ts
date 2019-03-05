import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './manvendors.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ManVendorsComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   vendors:any = [];
   costcenters = {};
   itemcode = {};
   totalAjax = 0; 
   editId = null;
   loader = false;
   selectedlineItems = [];
   checkAll = false;
   dup:any;
   vendor =null;
   ngOnInit(){
        this.loader = true;
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        this.loadVendors();
        this.loadCostCenter();
        this.loadItemCode();
   }   
   loadVendors() {
       this.ajaxService.getVendors().subscribe(result => { 
        this.vendors = JSON.parse(result.jsondata); 
        this.totalAjax = this.totalAjax + 1; 
        this.disableLoader();
        if (this.vendors.length == 0) {
         $("input:checkbox[name=tablecheck]").prop("disabled", true);;   
       }         
       });

   }
   loadCostCenter () {
       this.loader = true;
       this.ajaxService.getCostCenters().subscribe(result => { 
        this.costcenters = result; 
        this.totalAjax = this.totalAjax + 1; 
        this.disableLoader();        
       });       
   } 
   loadItemCode () {
       this.loader = true;
       this.ajaxService.GetItemCodeByCompanyId().subscribe(result => { 
        this.itemcode = result; 
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
       for (var i = 0; i < this.vendors.length; i++) {
        if (this.checkAll) {
            if (this.selectedlineItems.indexOf(this.vendors[i].vendor_id)== -1) {
               this.selectedlineItems.push(this.vendors[i].vendor_id);
            }
        } else {
           var index = this.selectedlineItems.indexOf(this.vendors[i].vendor_id);
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
       for (var i = 0; i < this.vendors.length; i++) {
           if (this.selectedlineItems.indexOf(this.vendors[i].vendor_id)==-1) {
               return true;
           }           
       }
       this.checkAll = true;       
   }   
   editVendor(vendor) {
       this.dup = $.extend(true, {}, vendor);
       this.editId = vendor.vendor_id
   }
   cancelEdit (i) {
       this.editId = 0;
       this.vendors[i] = this.dup;
   }
   saveVendor(vendor) {
       if (vendor.vendor_name == '') {
         this.toastr.error('Please enter vendor.'); 
         return false         
       }
       if (vendor.vendor_code == '') {
         this.toastr.error('Please enter vendor code.'); 
         return false         
       }
    //    if (vendor.item_id == 0) {
    //      this.toastr.error('Please select default item code.'); 
    //      return false         
    //    }
    //    if (vendor.cost_center_id == 0) {
    //      this.toastr.error('Please select default cost center.'); 
    //      return false         
    //    }   
    //    if (vendor.excemption_certificate_num == '') {
    //      this.toastr.error('Please enter excemption certificate number.'); 
    //      return false         
    //    } 
       this.loader = true;
       this.ajaxService.updateVendor(vendor).subscribe(result => {
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

   deleteBulkModalVendors() {
      if (this.selectedlineItems.length == 0) {
      this.toastr.error('Please select one item.');
      return false;
     }
    $('#deleteModalHisBulk').modal('show');
 }
 CancelBulkDelVendor(){
    $('#deleteCommentsBulk').val('');
 } 
 okDelBulkVendors() {
    if (!$('#deleteCommentsBulk').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delVendor(this.selectedlineItems).subscribe(result => {
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
            
}
   delmodalVendor(vendor) {
    $('#deleteModalHis').modal('show');
    this.vendor = vendor;
   }

   CancelDelVendor(){
    $('#deleteCommentsHis').val('');
    } 

   okDelVendor() {
    if (!$('#deleteCommentsHis').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delVendor([this.vendor.vendor_id]).subscribe(result => {
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
   delVendor(vendor) {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delVendor([vendor.vendor_id]).subscribe(result => {
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
           this.ajaxService.delVendor(this.selectedlineItems).subscribe(result => {
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
       this.ajaxService.bulkUpdateVendor(show, this.selectedlineItems, this.vendors).subscribe(result => {
           this.toastr.success('Updated successfully.');
           this.loader = false;
           this.selectedlineItems = [];
           this.loadVendors();
           this.selectAllButton();
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       }); 
   }    
}
