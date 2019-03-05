import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  templateUrl: './rules.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class RulesComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService) {}
   loader = false;
   trustedVendors:any = {};   
   untrustedVendors = {};
   ItemCodes:any = {};
   ItemCodesForReview:any = {};
   ItemCodesForAllocation:any = {};
   vendors:any = {};
   vendorsForReview:any = {};
   vendorsForAllocation:any = {};
   costCenters:any = {};
   costCentersForReview:any = {};
   costCentersForAllocation:any = {};
   taxableamount = 0;
   btaxableamount = 0;
   posttaxableamount = 0;
   totalAjax = 0;
   selectedCompName = '';
   ngOnInit(){
        this.loader = true;
        this.loadTrustedvendors();
        this.loadItemCodes();
        this.loadItemCodesForReview();
        this.loadItemCodesForAllocation();
        this.loadVendor();
        this.loadVendorForReview();
        this.loadVendorForAllocation();
        this.loadCostCenters();
        this.loadCostCentersForReview();
        this.loadCostCentersForAllocation();
        this.loadTaxableAmount();
        this.LoadVarianceForLineItemsCommit();
        this.loadUnTrustedvendors();
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }         
   }
   loadTrustedvendors () {
       this.ajaxService.getTrustedvendors().subscribe(result => { 
        this.trustedVendors = result; 
        this.totalAjax = this.totalAjax + 1; 
        setTimeout(function () {
            $('#trustedVendors').fastselect();
        }, 10);
        this.disableLoader();        
       }, error => {
          this.totalAjax = this.totalAjax + 1; 
          this.disableLoader();
       });       
   }
   loadUnTrustedvendors () {
       this.ajaxService.getUnTrustedvendors().subscribe(result => { 
        this.untrustedVendors = result; 
        this.totalAjax = this.totalAjax + 1; 
        setTimeout(function () {
            $('#untrustedVendors').fastselect();;
        }, 10);
        this.disableLoader();        
       }, error => {
          this.totalAjax = this.totalAjax + 1; 
          this.disableLoader();
       });       
   }   
   loadItemCodes () {
       this.ajaxService.getItemCodes().subscribe(result => { 
        this.ItemCodes = result; 
        this.totalAjax = this.totalAjax + 1;  
        setTimeout(function () {
            $('#itemCodes').fastselect();;
        }, 10);
        this.disableLoader();
       }, error => {
          this.totalAjax = this.totalAjax + 1; 
          this.disableLoader();
       });       
   }
   loadItemCodesForReview () {
       this.ajaxService.getItemCodesForReview().subscribe(result => { 
        this.ItemCodesForReview = result; 
        this.totalAjax = this.totalAjax + 1;  
        setTimeout(function () {
            $('#postitemCodes1').fastselect();;
        }, 10);
        this.disableLoader();
       }, error => {
          this.totalAjax = this.totalAjax + 1; 
          this.disableLoader();
       });       
   }
   loadItemCodesForAllocation () {
       this.ajaxService.getItemCodesForAllocation().subscribe(result => { 
        this.ItemCodesForAllocation = result; 
        this.totalAjax = this.totalAjax + 1;  
        setTimeout(function () {
            $('#postitemCodes2').fastselect();;
        }, 10);
        this.disableLoader();
       }, error => {
          this.totalAjax = this.totalAjax + 1; 
          this.disableLoader();
       });       
   }   
   loadVendor () {
       this.ajaxService.getVendors().subscribe(result => { 
        this.vendors = result; 
        this.totalAjax = this.totalAjax + 1; 
        setTimeout(function () {
            $('#vendors').fastselect();;
        }, 10);
        this.disableLoader();        
       }, error => {
          this.totalAjax = this.totalAjax + 1; 
          this.disableLoader();
       });       
   } 
   loadVendorForReview () {
       this.ajaxService.getVendorsForReview().subscribe(result => { 
        this.vendorsForReview = result; 
        this.totalAjax = this.totalAjax + 1; 
        setTimeout(function () {
            $('#postvendors1').fastselect();;
        }, 10);
        this.disableLoader();        
       }, error => {
          this.totalAjax = this.totalAjax + 1; 
          this.disableLoader();
       });       
   }
   loadVendorForAllocation () {
       this.ajaxService.getVendorsForAllocation().subscribe(result => { 
        this.vendorsForAllocation = result; 
        this.totalAjax = this.totalAjax + 1; 
        setTimeout(function () {
            $('#postvendors2').fastselect();;
        }, 10);
        this.disableLoader();        
       }, error => {
          this.totalAjax = this.totalAjax + 1; 
          this.disableLoader();
       });       
   }     
   loadCostCenters () {
       this.ajaxService.getCostCenters().subscribe(result => { 
        this.costCenters = result; 
        this.totalAjax = this.totalAjax + 1;  
        setTimeout(function () {
            $('#costCenters').fastselect();;
        }, 10);
        this.disableLoader();
       }, error => {
          this.totalAjax = this.totalAjax + 1; 
          this.disableLoader();
       });       
   }
   loadCostCentersForReview () {
       this.ajaxService.getCostCentersForReview().subscribe(result => { 
        this.costCentersForReview = result; 
        this.totalAjax = this.totalAjax + 1;  
        setTimeout(function () {
            $('#postcostCenters1').fastselect();;
        }, 10);
        this.disableLoader();
       }, error => {
          this.totalAjax = this.totalAjax + 1; 
          this.disableLoader();
       });       
   }   
   loadCostCentersForAllocation () {
       this.ajaxService.getCostCentersForAllocation().subscribe(result => { 
        this.costCentersForAllocation = result; 
        this.totalAjax = this.totalAjax + 1;  
        setTimeout(function () {
            $('#postcostCenters2').fastselect();;
        }, 10);
        this.disableLoader();
       }, error => {
          this.totalAjax = this.totalAjax + 1; 
          this.disableLoader();
       });       
   }    
   loadTaxableAmount() {
       this.ajaxService.getTaxableAmount().subscribe(result => { 
        this.taxableamount = result.taxableamount;
        this.btaxableamount = result.taxableamount;
        this.totalAjax = this.totalAjax + 1; 
        this.disableLoader();
       }, error => {
          this.totalAjax = this.totalAjax + 1; 
          this.disableLoader();
       });       
   }
   LoadVarianceForLineItemsCommit() {
       this.ajaxService.GetVarianceForLineItemsCommit().subscribe(result => { 
        this.posttaxableamount = result.varianceamount;
        this.totalAjax = this.totalAjax + 1; 
        this.disableLoader();
       }, error => {
          this.totalAjax = this.totalAjax + 1; 
          this.disableLoader();
       });       
   }      
   disableLoader(){
       if (this.totalAjax == 13) {
           this.loader = false;
       }
   }
   saveTaxableAmount() {
       if(this.taxableamount<0) {
           this.toastr.error('Please enter non-negative value.');
           return false;
       }
       if(this.taxableamount==null) {
           this.toastr.error('Please enter value.');
           return false;
       }       
       this.loader = true;
       this.ajaxService.saveTaxableAmount(this.taxableamount).subscribe(result => {
           this.toastr.success('Saved successfully.');
           this.btaxableamount = this.taxableamount;
           this.loader = false;
       }, error => {
           this.toastr.error('Error.');
           this.loader = false;
       });              
   }
   savevariance() {
       this.loader = true;
       this.ajaxService.SetVarianceForLineItemsCommit(this.posttaxableamount).subscribe(result => {
           this.toastr.success('Saved successfully.');
           this.loader = false;
       }, error => {
           this.toastr.error('Error.');
           this.loader = false;
       });              
   }   
   saveTrustedVendors() {
       /*if ($("#trustedVendors").val() == null) {
           this.toastr.error('Please select atlease one value.');
           return false;
       } */         
       this.loader = true;
       var vendors = '';
       if($( "#trustedVendors" ).val()!=null && $( "#trustedVendors" ).val()!= "") {
        vendors = $( "#trustedVendors" ).val().join(',');
       }
       this.ajaxService.saveTrustedVendors(vendors).subscribe(result => {
           this.toastr.success('Saved successfully.');
           this.loader = false;
       }, error => {
           this.toastr.error('Error.');
           this.loader = false;
       });              
   }  
   saveUnTrustedVendors() {
      /* if (!$( "#untrustedVendors" ).val()) {
           this.toastr.error('Please select atlease one value.');
           return false;
       }    */    
       this.loader = true;
       var vendors = '';
       if($( "#untrustedVendors" ).val()!=null && $( "#untrustedVendors" ).val()!= "") {
        vendors = $( "#untrustedVendors" ).val().join(',');
       }
       this.ajaxService.saveunTrustedVendors(vendors, $( "input[name='radio']:checked" ).val()).subscribe(result => {
           this.toastr.success('Saved successfully.');
           this.loader = false;
       }, error => {
           this.toastr.error('Error.');
           this.loader = false;
       });              
   }    
   saveItemCode() {
       if (!$( "#itemCodes" ).val()) {
           this.toastr.error('Please select atlease one value.');
           return false;
       }          
       this.loader = true;
       this.ajaxService.saveItemCode($( "#itemCodes" ).val().join(',')).subscribe(result => {
           this.toastr.success('Saved successfully.');
           this.loader = false;
       }, error => {
           this.toastr.error('Error.');
           this.loader = false;
       });              
   } 
   saveVendors() {
       if (!$( "#vendors" ).val()) {
           this.toastr.error('Please select atlease one value.');
           return false;
       }
       this.loader = true;
       this.ajaxService.saveVendors($( "#vendors" ).val().join(',')).subscribe(result => {
           this.toastr.success('Saved successfully.');
           this.loader = false;
       }, error => {
           this.toastr.error('Error.');
           this.loader = false;
       });              
   } 
   saveCostcenter() {
       if (!$( "#costCenters" ).val()) {
           this.toastr.error('Please select atlease one value.');
           return false;
       }       
       this.loader = true;
       this.ajaxService.saveCostcenter($( "#costCenters" ).val().join(',')).subscribe(result => {
           this.toastr.success('Saved successfully.');
           this.loader = false;
       }, error => {
           this.toastr.error('Error.');           
           this.loader = false;
       });              
   }
   savePostItemCode1() {
       if (!$( "#postitemCodes1" ).val()) {
           this.toastr.error('Please select atlease one value.');
           return false;
       }         
       this.loader = true;
       this.ajaxService.saveItemCodeForReview($( "#postitemCodes1" ).val().join(',')).subscribe(result => {
           this.toastr.success('Saved successfully.');
           this.loader = false;
       }, error => {
           this.toastr.error('Error.');
           this.loader = false;
       });              
   } 
   savePostVendors1() {
       if (!$( "#postvendors1" ).val()) {
           this.toastr.error('Please select atlease one value.');
           return false;
       }        
       this.loader = true;
       this.ajaxService.saveVendorsForReview($( "#postvendors1" ).val().join(',')).subscribe(result => {
           this.toastr.success('Saved successfully.');
           this.loader = false;
       }, error => {
           this.toastr.error('Error.');
           this.loader = false;
       });              
   } 
   savePostCostcenter1() {
       if (!$( "#postcostCenters1" ).val()) {
           this.toastr.error('Please select atlease one value.');
           return false;
       }          
       this.loader = true;
       this.ajaxService.saveCostcenterForReview($( "#postcostCenters1" ).val().join(',')).subscribe(result => {
           this.toastr.success('Saved successfully.');
           this.loader = false;
       }, error => {
           this.toastr.error('Error.');
           this.loader = false;
       });              
   } 
   savePostItemCode2() {
       if (!$( "#postitemCodes2" ).val()) {
           this.toastr.error('Please select atlease one value.');
           return false;
       }       
       this.loader = true;
       this.ajaxService.saveItemCodeForAllocation($( "#postitemCodes2" ).val().join(',')).subscribe(result => {
           this.toastr.success('Saved successfully.');
           this.loader = false;
       }, error => {
           this.toastr.error('Error.');
           this.loader = false;
       });              
   } 
   savePostVendors2() {
       if (!$( "#postvendors2" ).val()) {
           this.toastr.error('Please select atlease one value.');
           return false;
       }          
       this.loader = true;
       this.ajaxService.saveVendorsForAlloc($( "#postvendors2" ).val().join(',')).subscribe(result => {
           this.toastr.success('Saved successfully.');
           this.loader = false;
       }, error => {
           this.toastr.error('Error.');
           this.loader = false;
       });              
   } 
   savePostCostcenter2() {
       if (!$( "#postcostCenters2" ).val()) {
           this.toastr.error('Please select atlease one value.');
           return false;
       }       
       this.loader = true;
       this.ajaxService.saveCostcenterForAlloc($( "#postcostCenters2" ).val().join(',')).subscribe(result => {
           this.toastr.success('Saved successfully.');
           this.loader = false;
       }, error => {
           this.toastr.error('Error.');
           this.loader = false;
       });              
   } 
   cancel() {
       this.taxableamount = this.btaxableamount;
   }  
   cancelTrustedVendors() {
       $("#trustedVendors option").attr('selected', false);
        $(this.trustedVendors.vendorslist).each(function(index,obj){
            if (obj.trusted == 'Y') {
                $("#trustedVendors option[value='"+obj.vendorid+"']").prop('selected', 'selected');
            }            
        }); 
        $('#trustedVendors').data('fastselect').destroy();  
        $('#trustedVendors').fastselect();       
   }
   cancelZerotaxItemCode() {
       $("#itemCodes option").attr('selected', false);
        $(this.ItemCodes.itemdetails).each(function(index,obj){
            if (obj.trusted == 'Y') {
                $("#itemCodes option[value='"+obj.itemid+"']").prop('selected', 'selected');
            }            
        }); 
        $('#itemCodes').data('fastselect').destroy();  
        $('#itemCodes').fastselect();       
   } 
   cancelZerotaxVendor() {
       $("#vendors option").attr('selected', false);
        $(this.vendors.vendorslist).each(function(index,obj){
            if (obj.trusted == 'Y') {
                $("#vendors option[value='"+obj.vendorid+"']").prop('selected', 'selected');
            }            
        }); 
        $('#vendors').data('fastselect').destroy();  
        $('#vendors').fastselect();       
   }
   cancelZerotaxCostCen() {
       $("#costCenters option").attr('selected', false);
        $(this.costCenters.costcenterslist).each(function(index,obj){
            if (obj.trusted == 'Y') {
                $("#costCenters option[value='"+obj.costcenterid+"']").prop('selected', 'selected');
            }            
        }); 
        $('#costCenters').data('fastselect').destroy();  
        $('#costCenters').fastselect();       
   } 
   cancelRevItemCode() {
       $("#postitemCodes1 option").attr('selected', false);
        $(this.ItemCodesForReview.itemslist).each(function(index,obj){
            if (obj.markedforreview == 'Y') {
                $("#postitemCodes1 option[value='"+obj.itemid+"']").prop('selected', 'selected');
            }            
        }); 
        $('#postitemCodes1').data('fastselect').destroy();  
        $('#postitemCodes1').fastselect();       
   }
   cancelRevendor() {
       $("#postvendors1 option").attr('selected', false);
        $(this.vendorsForReview.vendorslist).each(function(index,obj){
            if (obj.markedforreview == 'Y') {
                $("#postvendors1 option[value='"+obj.vendorid+"']").prop('selected', 'selected');
            }            
        }); 
        $('#postvendors1').data('fastselect').destroy();  
        $('#postvendors1').fastselect();       
   }
   cancelRevCostcenter() {
       $("#postcostCenters1 option").attr('selected', false);
        $(this.costCentersForReview.costcenters).each(function(index,obj){
            if (obj.tobereviewed == 'Y') {
                $("#postcostCenters1 option[value='"+obj.costcenterid+"']").prop('selected', 'selected');
            }            
        }); 
        $('#postcostCenters1').data('fastselect').destroy();  
        $('#postcostCenters1').fastselect();       
   }
   cancelAlloMarkAllo() {
       $("#postitemCodes2 option").attr('selected', false);
        $(this.ItemCodesForAllocation.itemdetails).each(function(index,obj){
            if (obj.tobeallocated == 'Y') {
                $("#postitemCodes2 option[value='"+obj.itemid+"']").prop('selected', 'selected');
            }            
        }); 
        $('#postitemCodes2').data('fastselect').destroy();  
        $('#postitemCodes2').fastselect();       
   }
   cancelAlloVendors() {
       $("#postvendors2 option").attr('selected', false);
        $(this.vendorsForAllocation.vendorslist).each(function(index,obj){
            if (obj.tobeallocated == 'Y') {
                $("#postvendors2 option[value='"+obj.vendorid+"']").prop('selected', 'selected');
            }            
        }); 
        $('#postvendors2').data('fastselect').destroy();  
        $('#postvendors2').fastselect();       
   } 
   cancelAlloCostcenter() {
       $("#postcostCenters2 option").attr('selected', false);
        $(this.costCentersForAllocation.costcenterslist).each(function(index,obj){
            if (obj.tobeallocated == 'Y') {
                $("#postcostCenters2 option[value='"+obj.costcenterid+"']").prop('selected', 'selected');
            }            
        }); 
        $('#postcostCenters2').data('fastselect').destroy();  
        $('#postcostCenters2').fastselect();       
   }  
   omit_special_char(event)
{   
   var k;  
   k = event.charCode;  //         k = event.keyCode;  (Both can be used)
   return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
}  
}