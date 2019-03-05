import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './manlocations.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ManLocationsComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   locations:any = [];
   costcenters = {};
   purposes = {};
   totalAjax = 0; 
   editId = null;
   loader = false;
   selectedlineItems = [];
   checkAll = false;
   dup:any;
   location = null;
   ngOnInit(){
        this.loader = true;
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        this.loadLocations();
        this.loadCostCenter();
        this.loadPurpose();
   }   
   loadLocations() {
       this.ajaxService.getLocations().subscribe(result => { 
        this.locations = JSON.parse(result.jsondata); 
        this.totalAjax = this.totalAjax + 1; 
        this.disableLoader();  
        if (this.locations.length == 0) {
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
       for (var i = 0; i < this.locations.length; i++) {
        if (this.checkAll) {
            if (this.selectedlineItems.indexOf(this.locations[i].destination_address_id)== -1) {
               this.selectedlineItems.push(this.locations[i].destination_address_id);
            }
        } else {
           var index = this.selectedlineItems.indexOf(this.locations[i].destination_address_id);
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
       for (var i = 0; i < this.locations.length; i++) {
           if (this.selectedlineItems.indexOf(this.locations[i].destination_address_id)==-1) {
               return true;
           }           
       }
       this.checkAll = true;       
   }   
   editItem(loca) {
       this.dup = $.extend(true, {}, loca);
       this.editId = loca.destination_address_id
   }
   cancelEdit (i) {
       this.editId = 0;
       this.locations[i] = this.dup;
   }
   saveLoca(loca) {
    //    if (!loca.cost_center_id) {
    //      this.toastr.error('Please select the cost center name.'); 
    //      return false         
    //    }
    //    if (!loca.purpose_id) {
    //      this.toastr.error('Please select the purpose.'); 
    //      return false         
    //    }
       this.loader = true;       
       this.ajaxService.updateLocation(loca).subscribe(result => {
           this.toastr.success('Upaded successfully.');
           this.loader = false;
           this.selectedlineItems = [];
           this.loadLocations()
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });         
   }
   changeOpt(evnt, vendor) {
       vendor.show_in_filter = evnt.target.checked ? 1 :0;
   }

   deletemodallocaltion(location) {
    $('#deleteModalHis').modal('show');
    this.location = location;
 }
 CancelDelLocaltion(){
    $('#deleteCommentsHis').val('');
 } 

 okDelLocation() {
    if (!$('#deleteCommentsHis').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;

     this.ajaxService.delLoc([this.location.destination_address_id]).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loader = false;
        this.selectedlineItems = [];
        this.loadLocations();
        $('#deleteCommentsHis').val('');
         $('#deleteModalHis').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    }); 
     $("input:checkbox[name=tablecheck]").prop("checked", "");       
} 


deleteBulkModalLocaltion() {
   if (this.selectedlineItems.length == 0) {
      this.toastr.error('Please select one item.');
      return false;
     }
    $('#deleteModalHisBulk').modal('show');
 }
 CancelBulkDelLocaltion(){
    $('#deleteCommentsBulk').val('');
 } 

 okDelBulkLocations() {
    if (!$('#deleteCommentsBulk').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delLoc(this.selectedlineItems).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loader = false;
        this.selectedlineItems = [];
        this.loadLocations();
        $('#deleteCommentsBulk').val('');
         $('#deleteModalHisBulk').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });        
} 


   delLoc(loca) {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delLoc([loca.destination_address_id]).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loader = false;
               this.selectedlineItems = [];
               this.loadLocations();
           }, error => {
               this.loader = false;
               this.toastr.error('Error.');
           }); 
       }           
   }   
   bulkDel() {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delLoc(this.selectedlineItems).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loader = false;
               this.selectedlineItems = [];
               this.loadLocations();
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
       this.ajaxService.bulkUpdateLoc(show, this.selectedlineItems, this.locations).subscribe(result => {
           this.toastr.success('Updated successfully.');
           this.loader = false;
           this.selectedlineItems = [];
           this.loadLocations();
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       }); 
        $("input:checkbox[name=tablecheck]").prop("checked", "");
   }    
}
