import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './mancostcenters.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MancostcentersComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   costcenters:any = [];
   purpose = {};
   itemcode = {};
   totalAjax = 0; 
   editId = null;
   loader = false;
   selectedlineItems = [];
   checkAll = false;
   center = null;
   dup:any;
   ngOnInit(){
        this.loader = true;
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        this.loadCostcenters();
        this.loadPurpose();
        this.loadItemCode();
   }   
   loadCostcenters() {
       this.ajaxService.Getcostcenters().subscribe(result => { 
        this.costcenters = JSON.parse(result.jsondata); 
        this.totalAjax = this.totalAjax + 1; 
        this.disableLoader(); 
        if (this.costcenters.length == 0) {
         $("input:checkbox[name=tablecheck]").prop("disabled", true);;   
       }       
       }); 
   }
   loadPurpose () {
       this.ajaxService.GetPurposeCodesByCompany().subscribe(result => { 
        this.purpose = result; 
        this.totalAjax = this.totalAjax + 1; 
        this.disableLoader();        
       });       
   } 
   loadItemCode () {
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
       for (var i = 0; i < this.costcenters.length; i++) {
        if (this.checkAll) {
            if (this.selectedlineItems.indexOf(this.costcenters[i].cost_center_id)== -1) {
               this.selectedlineItems.push(this.costcenters[i].cost_center_id);
            }
        } else {
           var index = this.selectedlineItems.indexOf(this.costcenters[i].cost_center_id);
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
       for (var i = 0; i < this.costcenters.length; i++) {
           if (this.selectedlineItems.indexOf(this.costcenters[i].cost_center_id)==-1) {
               return true;
           }           
       }
       this.checkAll = true;       
   }   
   editCostCeter(center) {
       this.dup = $.extend(true, {}, center);
       this.editId = center.cost_center_id
   }
   cancelEdit (i) {
       this.editId = 0;
       this.costcenters[i] = this.dup;
   }
   saveCost(center) {
       if (center.cost_center_name == '') {
         this.toastr.error('Please enter cost center.'); 
         return false         
       }
    //    if (center.purpose_id == 0) {
    //      this.toastr.error('Please select default purpose code.'); 
    //      return false         
    //    }
    //    if (center.item_id == 0) {
    //      this.toastr.error('Please select item code.'); 
    //      return false         
    //    }
       this.loader = true;
       this.ajaxService.updateCostCenter(center).subscribe(result => {
           this.toastr.success('Upaded successfully.');
           this.loader = false;
           this.selectedlineItems = [];
           this.loadCostcenters();
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });         
   }
   changeOpt(evnt, center) {
       center.show_in_filter = evnt.target.checked ? 1 :0;
   }


deleteBulkModalCostCenter() {
    if (this.selectedlineItems.length == 0) {
      this.toastr.error('Please select one item.');
      return false;
     }
    $('#deleteModalHisBulk').modal('show');
 }
 CancelBulkDelCostCenter(){
    $('#deleteCommentsBulk').val('');
 } 

 okDelBulkCostCenters() {
    if (!$('#deleteCommentsBulk').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;

     this.ajaxService.delCostCenter(this.selectedlineItems).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loader = false;
        this.selectedlineItems = [];
        this.loadCostcenters();
        $('#deleteCommentsBulk').val('');
         $('#deleteModalHisBulk').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });
    $("input:checkbox[name=tablecheck]").prop("checked", "");         
} 
   deleteCostCeter(center) {
    $('#deleteModalHis').modal('show');
    this.center = center;
 }
 CancelDelCostCenter(){
    $('#deleteCommentsHis').val('');
 } 

 okDelCostCenter() {
    if (!$('#deleteCommentsHis').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delCostCenter([this.center.cost_center_id]).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loader = false;
        this.selectedlineItems = [];
        this.loadCostcenters();
        $('#deleteCommentsHis').val('');
         $('#deleteModalHis').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });        
} 
   delCostCeter(center) {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delCostCenter([center.cost_center_id]).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loader = false;
               this.selectedlineItems = [];
               this.loadCostcenters();
           }, error => {
               this.loader = false;
               this.toastr.error('Error.');
           }); 
       }           
   }   
   bulkDel() {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delCostCenter(this.selectedlineItems).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loader = false;
               this.selectedlineItems = [];
               this.loadCostcenters();
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
       this.ajaxService.bulkUpdateCostCenter(show, this.selectedlineItems, this.costcenters).subscribe(result => {
           this.toastr.success('Updated successfully.');
           this.loader = false;
           this.selectedlineItems = [];
           this.loadCostcenters();
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       }); 

      $("input:checkbox[name=tablecheck]").prop("checked", "");
   }    
}
