import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './mantaxcode.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ManTaxCodeComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   taxcodes:any = [];
   editId = null;
   loader = false;
   selectedlineItems = [];
   checkAll = false;
   dup:any;
   Tax = null;
   ngOnInit(){
        this.loader = true;
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        this.loadTaxCodes();
   }   
   loadTaxCodes() {
       this.ajaxService.getTaxCodes().subscribe(result => { 
        this.taxcodes = JSON.parse(result.jsondata); 
        this.loader = false;  
       if (this.taxcodes.length == 0) {
         $("input:checkbox[name=tablecheck]").prop("disabled", true);;   
       }             
       });   

   }   
   selectAll () {
       for (var i = 0; i < this.taxcodes.length; i++) {
        if (this.checkAll) {
            if (this.selectedlineItems.indexOf(this.taxcodes[i].tax_id)== -1) {
               this.selectedlineItems.push(this.taxcodes[i].tax_id);
            }
        } else {
           var index = this.selectedlineItems.indexOf(this.taxcodes[i].tax_id);
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
       for (var i = 0; i < this.taxcodes.length; i++) {
           if (this.selectedlineItems.indexOf(this.taxcodes[i].tax_id)==-1) {
               return true;
           }           
       }
       this.checkAll = true;       
   }   
   editTax(tax) {
       this.dup = $.extend(true, {}, tax);
       this.editId = tax.tax_id
   }
   cancelEdit (i) {
       this.editId = 0;
       this.taxcodes[i] = this.dup;
   }
   saveTax(tax) {
       if (tax.tax_code == '') {
         this.toastr.error('Please enter tax code.'); 
         return false         
       }
       this.loader = true;
       this.ajaxService.updateTaxCode(tax).subscribe(result => {
        if (result.statusmessage == 1111) {
            this.toastr.error(result.statuscode);
            this.loader = false;          
        }else{
           this.toastr.success('Upaded successfully.');
           this.loadTaxCodes();
        }
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });         
   }
   changeOpt(evnt, custom1) {
       custom1.show_in_filter = evnt.target.checked ? 1 :0;
   }
   deleteBulkModalTaxCode() {
      if (this.selectedlineItems.length == 0) {
      this.toastr.error('Please select one item.');
      return false;
     }
    $('#deleteModalHisBulk').modal('show');
 }
 CancelBulkDelTaxCode(){
    $('#deleteCommentsBulk').val('');
 } 

 okDelBulkTaxCodes() {
    if (!$('#deleteCommentsBulk').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delTax(this.selectedlineItems).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loadTaxCodes();
        this.selectedlineItems = [];
        $('#deleteCommentsBulk').val('');
         $('#deleteModalHisBulk').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });        
      $("input:checkbox[name=tablecheck]").prop("checked", "");
} 
   deleteTaxCode(Tax) {
    $('#deleteModalHis').modal('show');
    this.Tax = Tax;
 }
 CancelDelTaxCode(){
    $('#deleteCommentsHis').val('');
 } 

 okDelTaxCode() {
    if (!$('#deleteCommentsHis').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delTax([this.Tax.tax_id]).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loadTaxCodes();
        $('#deleteCommentsHis').val('');
         $('#deleteModalHis').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });        
} 

   delTax(tax) {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delTax([tax.tax_id]).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loadTaxCodes();
           }, error => {
               this.loader = false;
               this.toastr.error('Error.');
           }); 
       }           
   }   
   bulkDel() {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delTax(this.selectedlineItems).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loadTaxCodes();
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
       this.ajaxService.bulkUpdateTax(show, this.selectedlineItems, this.taxcodes).subscribe(result => {
           this.toastr.success('Updated successfully.');
           this.loadTaxCodes();
           this.selectedlineItems = [];
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       }); 
        $("input:checkbox[name=tablecheck]").prop("checked", "");
   }    
}
