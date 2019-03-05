import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transactions } from './transactions';

@Injectable()
export class AjaxService {
  constructor(private http: HttpClient) {}
  getVendorCodeValidFilter() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Misc/GetVendorCodeValidFilter', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "isfiltered": 'Y'}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  GetLocationsListByCompanyId() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Misc/GetLocationsValidFilter', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "isfiltered": 'Y'}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  GetLocationsListByCompanyIdAll() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Misc/GetLocationsListByCompanyId', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  loadFullLocations() {
    return this.http.post<{destinationslist:[{fullAddress:string,address:string,city:string,locationcode:string, region:string,postalcode:string,country: string}]}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetDestinationAddress', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  getFilteredCostCenters() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Misc/GetCostCenterValidFilter', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "isfiltered":'Y'}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  getCostCenters() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/GetCostCentersForZeroTaxByCompany', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  GetTaxCodeByCompanyId() {
    return this.http.post<{taxcodelist:[{}]}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetTaxCodeByCompanyId', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  GetTaxCodeFilter() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetTaxCodeValidFilter', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"isfiltered": 'Y'}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  GetPurchaseOrderFilter() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetPurchaseOrderFilter', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"isfiltered": 'Y'}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  GetPurchaseOrderWithoutFilter() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetPurchaseOrderFilter', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"isfiltered": 'N'}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }   
  GetRevAgentsFilter() {
    return this.http.post<{revenueaccountdata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetRevenueAccounts', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"isfiltered": 'Y'}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  GetRevAgentsWithoutFilter() {
    return this.http.post<{revenueaccountdata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetRevenueAccounts', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"isfiltered": 'N'}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }   
  GetCus1Filter() {
    return this.http.post<{customref1data:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetCustomRef1', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"isfiltered": 'Y'}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  GetCus1WithoutFilter() {
    return this.http.post<{customref1data:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetCustomRef1', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"isfiltered": 'N'}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  getItems() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Misc/GetItemsValidFilter', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "isfiltered": 'Y'}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 

  getImportFileNames() {
    return this.http.post<{files:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Import/GetImportFilesNames', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  GetCus2Filter() {
    return this.http.post<{customref2data:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetCustomRef2', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"isfiltered": 'Y'}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  GetCus2WithoutFilter() {
    return this.http.post<{customref2data:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetCustomRef2', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"isfiltered": 'N'}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }     
  GetPurchaseAgentFilter() {
    return this.http.post<{purchaseagents:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetPurchaseAgents', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"isfiltered": 'Y'}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  GetPurchaseAgentWithoutFilter() {
    return this.http.post<{purchaseagents:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetPurchaseAgents', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"isfiltered": 'N'}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }   
  GetPurposeCodesByCompany() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetPurposeCodesValidFilter', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"isfiltered": 'Y'}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  GetAllPurposeCodesByCompany() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetPurposeCodesByCompany', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  GetDocumentTypesByCompany() {
    return this.http.post<{documentstypelist:[{}]}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetDocumentTypesByCompany', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  GetAccrualMethodsByCompany() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetAccrualMethodsByCompany', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  GetCompaniesByUser() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Account/GetCompanyListByUser', JSON.stringify({ "userid": 1}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }   
  GetVarianceByCompany() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetVarianceList', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  getTransactions(obj) {
    return this.http.post<Transactions>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Import/GetLineItems', JSON.stringify(obj), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  saveItem(item) {
    return this.http.post<{statuscode:0}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Import/UpdateLineItemDetails', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "lineitemdata": JSON.stringify(item)}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  markforallocation(items) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Transaction/MarkLineItemsForAllocation', JSON.stringify({ "lineitemids": items.join(','), "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  allocate(items) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Transaction/AllocateItems', JSON.stringify({ "itemids": items, "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  calculate(items) {
    return this.http.post<{statusmessage:'', statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/transaction/CalculateLineItemsTax', JSON.stringify({ "requestjson": JSON.stringify(items)}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }    
  Confirmtransactios(items) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Transaction/ConfirmLineItems', JSON.stringify({ "lineitemids": items.join(','), "userid":localStorage.getItem("userId"), "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  Committoavatax(items,status) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Transaction/CommitLineItems', JSON.stringify({ "lineitemids": items, "companyid": localStorage.getItem("seleCompany"), "i_status_code":status}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  deleteLineItems(comments, items) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Transaction/DeleteLineItems', JSON.stringify({ "lineitemids": items.join(','), "comment": comments, "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  exportLineItems(items,balancing) {
    return this.http.post<{filecontent:'', statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Transaction/ExportLineItems', JSON.stringify({ "lineitemids": items.join(','), "companyid": localStorage.getItem("seleCompany"), "balancing" : balancing}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  exportLineItems2(comment, colomns, items, balancing) {
    return this.http.post<{filedata:'', statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Transaction/GetTransactionReport', JSON.stringify({ "comment":comment, "columnheader":colomns.join(","),"userid":"21", "companyid": localStorage.getItem("seleCompany"), "lineitemids":items.join(','), "balancing" : balancing}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }   
  getLineItemHistory(doc, cutlinenumber) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Import/GetLineItemHistory', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),   "docid": doc, "cutlinenumber": cutlinenumber,  "pagenumber": "1", "noofrecords": "30"}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});      
  }
  getAllocatedItems(lineItemid) {
    return this.http.post<{allocatedItemDetails:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Import/GetAllocatedItems', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "lineitemid": lineItemid}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});      
  } 
  getItemDetails(lineItemid,i_for_use) {
    return this.http.post<{lineitemdata:any,statusmessage:any,statuscode:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Import/GetLineItemCompleteDetails', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "lineitemid": lineItemid, "i_for_use":i_for_use}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});      
  }
  allocateItem(splitdata, lineItemId) {  
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Transaction/AllocateItems', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "splitdata": JSON.stringify(splitdata),"lineitemid": lineItemId}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});  
  }
  bulkAllocateItem(data, lineItemIds) {  
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Transaction/BulkAllocationItems', JSON.stringify({ "allocationdata": JSON.stringify(data),"lineitemids": lineItemIds.join(',')}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});  
  }  
  saveTaxorItemCode(obj) {
    return this.http.post<{statuscode:0}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Transaction/BulkTaxItemUpdate', obj, {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
}

