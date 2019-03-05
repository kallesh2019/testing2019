import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AjaxService {
  constructor(private http: HttpClient) {}
  getTrustedvendors() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/GetVendorsForConfirmInvoiceListByCompany', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  getUnTrustedvendors() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/GetUntrustedVendors', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  getItemCodes() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/GetItemCodesForZeroTaxByCompany', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  getItemCodesForReview() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/GetItemsForReviewByItemCode', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  getItemCodesForAllocation() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/GetItemsForAllocation', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }   
  getVendors() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/GetVendorsForZeroTaxByCompany', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  getVendorsForReview() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/GetVendorsForReviewByVendorCode', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  getVendorsForAllocation() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/GetVendorsForAllocation', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
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
  getCostCentersForReview() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/GetCostCentersForReview', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  getCostCentersForAllocation() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/GetCostCentersForAllocation', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  getTaxableAmount() {
    return this.http.post<{taxableamount:0}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/GetMinTaxableAmountByCompany', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  GetVarianceForLineItemsCommit() {
    return this.http.post<{varianceamount:0}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/GetVarianceForLineItemsCommit', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  saveTaxableAmount(taxableamount) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/SaveTaxableAmountConfirmItem', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "minimumtaxableamount":taxableamount}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  SetVarianceForLineItemsCommit(taxableamount) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/SetVarianceForLineItemsCommit', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "varianceamount":taxableamount}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }   
  saveTrustedVendors(trustedvendorslist) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/SetTrustedVendors', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "trustedvendorslist":trustedvendorslist}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  saveunTrustedVendors(trustedvendorslist, checked) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/MarkUntrustedVendors', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "vendorids":trustedvendorslist, "truestedflag": checked}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }   
  saveItemCode(itemCodes) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/SetZeroTaxForItems', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "itemcodes":itemCodes}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  saveItemCodeForReview(itemCodes) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/SetItemsForReviewByItemCode', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "itemcodes":itemCodes}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }   
  saveItemCodeForAllocation(itemCodes) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/MarkForAllocationByItemId', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "itemids":itemCodes}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  saveVendors(vendorslist) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/SetZeroTaxForVendors', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "vendorslist":vendorslist}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  saveVendorsForReview(vendorslist) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/SetVendorsForReviewByVendorCode', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "vendorids":vendorslist}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }   
  saveVendorsForAlloc(vendorslist) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/MarkVendorsForAllocation', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "trustedvendorslist":vendorslist}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }     
  saveCostcenter(costCenter) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/SetZeroTaxForCostCenters', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "costcenterslist":costCenter}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  saveCostcenterForReview(costCenter) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/SetCostCenterForReviewByCostCenterCode', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "costcentersid":costCenter}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  saveCostcenterForAlloc(costCenter) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/MarkCostCenterForAllocation', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "costcenterids":costCenter}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }   
}
