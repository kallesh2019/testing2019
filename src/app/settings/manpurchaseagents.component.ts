import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { AjaxService} from './ajax.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

declare var $: any;

@Component({
  templateUrl: './manpurchaseagents.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ManpurchaseagentsComponent {
   constructor(private ajaxService: AjaxService, private router: Router, private toastr: ToastrService, private completerService: CompleterService) {}
   selectedCompName = '';
   purchaseAgents:any = [];
   editId = null;
   loader = false;
   selectedlineItems = [];
   checkAll = false;
   dup:any;
   Agent = null;
   ngOnInit(){
        this.loader = true;
        if (localStorage.getItem("seleCompanyName")) {
            this.selectedCompName = localStorage.getItem("seleCompanyName");
        }
        this.loadPurchaseAgents();
   }   
   loadPurchaseAgents() {
       this.ajaxService.getPurchaseAgents().subscribe(result => { 
        this.purchaseAgents = JSON.parse(result.jsondata); 
        this.loader = false; 
       if (this.purchaseAgents.length == 0) {
         $("input:checkbox[name=tablecheck]").prop("disabled", true);;   
       }          
       });   

   }   
   selectAll () {
       for (var i = 0; i < this.purchaseAgents.length; i++) {
        if (this.checkAll) {
            if (this.selectedlineItems.indexOf(this.purchaseAgents[i].purchase_agent_id)== -1) {
               this.selectedlineItems.push(this.purchaseAgents[i].purchase_agent_id);
            }
        } else {
           var index = this.selectedlineItems.indexOf(this.purchaseAgents[i].purchase_agent_id);
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
       for (var i = 0; i < this.purchaseAgents.length; i++) {
           if (this.selectedlineItems.indexOf(this.purchaseAgents[i].purchase_agent_id)==-1) {
               return true;
           }           
       }
       this.checkAll = true;       
   }   
   editPurchaseAgent(agent) {
       this.dup = $.extend(true, {}, agent);
       this.editId = agent.purchase_agent_id
   }
   cancelEdit (i) {
       this.editId = 0;
       this.purchaseAgents[i] = this.dup;
   }
   savePurchaseAgent(agent) {
       if (agent.purchase_agent == '') {
         this.toastr.error('Please enter purchase agent.'); 
         return false         
       }
       this.loader = true;
       this.ajaxService.updatePurchaseAgent(agent).subscribe(result => {
        if (result.statusmessage == 1111) {
            this.toastr.error(result.statuscode);
            this.loader = false;          
        }else{     
        this.toastr.success('Upaded successfully.');
           this.loadPurchaseAgents()
        }
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       });         
   }
   changeOpt(evnt, agent) {
       agent.show_in_filter = evnt.target.checked ? 1 :0;
   }
   deleteBulkModalAgents() {
      if (this.selectedlineItems.length == 0) {
      this.toastr.error('Please select one item.');
      return false;
     }
    $('#deleteModalHisBulk').modal('show');
 }
 CancelBulkDelAgent(){
    $('#deleteCommentsBulk').val('');
 } 

 okDelBulkAgents() {
    if (!$('#deleteCommentsBulk').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delPurchaseAgent(this.selectedlineItems).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loadPurchaseAgents();
        this.selectedlineItems = [];
        $('#deleteCommentsBulk').val('');
         $('#deleteModalHisBulk').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });        
      $("input:checkbox[name=tablecheck]").prop("checked", "");
} 
   deleteAgent(Agent) {
    $('#deleteModalHis').modal('show');
    this.Agent = Agent;
 }
 CancelDelAgent(){
    $('#deleteCommentsHis').val('');
 } 

 okDelAgent() {
    if (!$('#deleteCommentsHis').val()) {
        this.toastr.error('Please enter comments.');
        return false;
    }       
     this.loader = true;
     this.ajaxService.delPurchaseAgent([this.Agent.purchase_agent_id]).subscribe(result => {
        this.toastr.success('Deleted successfully.');
        this.loadPurchaseAgents();
        $('#deleteCommentsHis').val('');
         $('#deleteModalHis').modal('hide');
    }, error => {
        this.loader = false;
        this.toastr.error('Error.');
    });       
} 
   delPurchaseAgent(agent) {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delPurchaseAgent([agent.purchase_agent_id]).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loadPurchaseAgents();
           }, error => {
               this.loader = false;
               this.toastr.error('Error.');
           }); 
       }           
   }   
   bulkDel() {
       if (confirm("Are you sure wanto to delete?")) {
           this.loader = true;
           this.ajaxService.delPurchaseAgent(this.selectedlineItems).subscribe(result => {
               this.toastr.success('Deleted successfully.');
               this.loadPurchaseAgents();
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
       this.ajaxService.bulkUpdatePurchasegent(show, this.selectedlineItems, this.purchaseAgents).subscribe(result => {
           this.toastr.success('Updated successfully.');
           this.loadPurchaseAgents();
           this.selectedlineItems = [];
       }, error => {
           this.loader = false;
           this.toastr.error('Error.');
       }); 
        $("input:checkbox[name=tablecheck]").prop("checked", "");
   }    
}
