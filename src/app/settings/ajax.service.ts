import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AjaxService {
  constructor(private http: HttpClient) {}
  GetPurposeCodesByCompany() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetPurposeCodesByCompany', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  Getcostcenters() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageCostCenter/CostCenterManage', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"optype": "get", "jsondata":''}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }   
  GetItemCodeByCompanyId() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/WorkFlowRules/GetItemsForAllocation', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  GetTaxCodeByCompanyId() {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetTaxCodeByCompanyId', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }   
  saveCostCenter(costcenter, purpose_id, itemcode, show_in_filter) {
    var obj = JSON.stringify([
    {"avatax_cost_center_id":"1",
    "cost_center_name":costcenter,
    "purpose_id":purpose_id,
    "item_id":itemcode,
    "company_id":localStorage.getItem("seleCompany"),
    "show_in_filter":show_in_filter,
    "insert_user":"iconic"}]);      
    return this.http.post<{statuscode: string, statusmessage: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageCostCenter/CostCenterManage', JSON.stringify({ "jsondata":obj, "optype": "set","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  updateCostCenter(costcenter) {
    var obj = JSON.stringify([
    {"avatax_cost_center_id":costcenter.avatax_cost_center_id,
    "cost_center_name":costcenter.cost_center_name,
    "purpose_id":costcenter.purpose_id,
    "item_id":costcenter.item_id,
    "company_id":costcenter.company_id,
    "show_in_filter":costcenter.show_in_filter,
    "insert_user":"iconic",
    "cost_center_id" : costcenter.cost_center_id}]);      
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageCostCenter/CostCenterManage', JSON.stringify({ "jsondata":obj, "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  bulkUpdateCostCenter(show, selectedlineItems, costcenters) {
    var obj = [];
    for (var i = 0; i < costcenters.length; i++) {
        if (selectedlineItems.indexOf(costcenters[i].cost_center_id) >= 0) {
            obj.push(
            {"avatax_cost_center_id":costcenters[i].avatax_cost_center_id,
            "cost_center_name":costcenters[i].cost_center_name,
            "purpose_id":costcenters[i].purpose_id,
            "item_id":costcenters[i].item_id,
            "company_id":costcenters[i].company_id,
            "show_in_filter":show,
            "insert_user":"iconic",
            "cost_center_id" : costcenters[i].cost_center_id});  
        }        
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageCostCenter/CostCenterManage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  delCostCenter(costcenters) {
    var obj = [];
    for (var i = 0; i < costcenters.length; i++) {
        obj.push({
        "cost_center_id" : costcenters[i],
        "insert_user":"iconic"}
        );      
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageCostCenter/CostCenterManage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "delete","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  savePurchaseAgent(purchaseagent, show_in_filter) {
    var obj = JSON.stringify([
    {
    "purchase_agent":purchaseagent,
    "company_id":localStorage.getItem("seleCompany"),
    "show_in_filter":show_in_filter,
    "insert_user":"iconic"}]);      
    return this.http.post<{statuscode: string,statusmessage :number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManagePurchaseAgent/PurchaseAgentManage', JSON.stringify({ "jsondata":obj, "optype": "set","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  getPurchaseAgents() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManagePurchaseAgent/PurchaseAgentManage', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"optype": "get", "jsondata":''}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  updatePurchaseAgent(agent) {
    var obj = JSON.stringify([
    {
    "purchase_agent":agent.purchase_agent,
    "company_id":agent.company_id,
    "show_in_filter":agent.show_in_filter,
    "insert_user":"iconic",
    "purchase_agent_id" : agent.purchase_agent_id
    }]);      
    return this.http.post<{statuscode: string,statusmessage :number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManagePurchaseAgent/PurchaseAgentManage', JSON.stringify({ "jsondata":obj, "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  delPurchaseAgent(agents) {
    var obj = [];
    for (var i = 0; i < agents.length; i++) {
        obj.push({
        "purchase_agent_id" : agents[i],
        "insert_user":"iconic"}
        );      
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManagePurchaseAgent/PurchaseAgentManage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "delete","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  bulkUpdatePurchasegent(show, selectedlineItems, agents) {
    var obj = [];
    for (var i = 0; i < agents.length; i++) {
        if (selectedlineItems.indexOf(agents[i].purchase_agent_id) >= 0) {
            obj.push(
            {
                "purchase_agent":agents[i].purchase_agent,
                "company_id":agents[i].company_id,
                "show_in_filter":show,
                "insert_user":"iconic",
                "purchase_agent_id" : agents[i].purchase_agent_id
           });  
        }        
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManagePurchaseAgent/PurchaseAgentManage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  saveRevAccount(revaccount, show_in_filter) {
    var obj = JSON.stringify([
    {
    "revenue_account":revaccount,
    "company_id":localStorage.getItem("seleCompany"),
    "show_in_filter":show_in_filter,
    "insert_user":"iconic"}]);      
    return this.http.post<{statuscode: string,statusmessage :number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageRevenueAccount/RevenAccountManage', JSON.stringify({ "jsondata":obj, "optype": "set","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  getRevAccounts() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageRevenueAccount/RevenAccountManage', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"optype": "get", "jsondata":''}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  updateRevAccount(account) {
    var obj = JSON.stringify([
    {
    "revenue_account":account.revenue_account,
    "company_id":account.company_id,
    "show_in_filter":account.show_in_filter,
    "insert_user":"iconic",
    "revenue_account_id" : account.revenue_account_id
    }]);      
    return this.http.post<{statuscode: string,statusmessage :number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageRevenueAccount/RevenAccountManage', JSON.stringify({ "jsondata":obj, "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  delRevAccount(accounts) {
    var obj = [];
    for (var i = 0; i < accounts.length; i++) {
        obj.push({
        "revenue_account_id" : accounts[i],
        "insert_user":"iconic"}
        );      
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageRevenueAccount/RevenAccountManage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "delete","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  bulkUpdateRevAccount(show, selectedlineItems, accounts) {
    var obj = [];
    for (var i = 0; i < accounts.length; i++) {
        if (selectedlineItems.indexOf(accounts[i].revenue_account_id) >= 0) {
            obj.push(
            {
                "revenue_account":accounts[i].revenue_account,
                "company_id":accounts[i].company_id,
                "show_in_filter":show,
                "insert_user":"iconic",
                "revenue_account_id" : accounts[i].revenue_account_id
           });  
        }        
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageRevenueAccount/RevenAccountManage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  saveCustom1(custom1, show_in_filter) {
    var obj = JSON.stringify([
    {
    "custom1":custom1,
    "company_id":localStorage.getItem("seleCompany"),
    "show_in_filter":show_in_filter,
    "insert_user":"iconic"}]);      
    return this.http.post<{statuscode: string,statusmessage :number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageCustom1/Custom1Manage', JSON.stringify({ "jsondata":obj, "optype": "set","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  getCustom1s() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageCustom1/Custom1Manage', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"optype": "get", "jsondata":''}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  updateCustom1(custom1) {
    var obj = JSON.stringify([
    {
    "custom1":custom1.custom1,
    "company_id":custom1.company_id,
    "show_in_filter":custom1.show_in_filter,
    "insert_user":"iconic",
    "custom1_id" : custom1.custom1_id
    }]);      
    return this.http.post<{statuscode: string,statusmessage :number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageCustom1/Custom1Manage', JSON.stringify({ "jsondata":obj, "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  delCustom1(custom1) {
    var obj = [];
    for (var i = 0; i < custom1.length; i++) {
        obj.push({
        "custom1_id" : custom1[i],
        "insert_user":"iconic"}
        );      
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageCustom1/Custom1Manage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "delete","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  bulkUpdateCustom1(show, selectedlineItems, custom1s) {
    var obj = [];
    for (var i = 0; i < custom1s.length; i++) {
        if (selectedlineItems.indexOf(custom1s[i].custom1_id) >= 0) {
            obj.push(
            {
                "custom1":custom1s[i].custom1,
                "company_id":custom1s[i].company_id,
                "show_in_filter":show,
                "insert_user":"iconic",
                "custom1_id" : custom1s[i].custom1_id
           });  
        }        
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageCustom1/Custom1Manage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  saveCustom2(custom2, show_in_filter) {
    var obj = JSON.stringify([
    {
    "custom2":custom2,
    "company_id":localStorage.getItem("seleCompany"),
    "show_in_filter":show_in_filter,
    "insert_user":"iconic"}]);      
    return this.http.post<{statuscode: string,statusmessage :number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageCustom2/Custom2Manage', JSON.stringify({ "jsondata":obj, "optype": "set","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  getCustom2s() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageCustom2/Custom2Manage', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"optype": "get", "jsondata":''}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  updateCustom2(custom2) {
    var obj = JSON.stringify([
    {
    "custom2":custom2.custom2,
    "company_id":custom2.company_id,
    "show_in_filter":custom2.show_in_filter,
    "insert_user":"iconic",
    "custom2_id" : custom2.custom2_id
    }]);      
    return this.http.post<{statuscode: string,statusmessage :number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageCustom2/Custom2Manage', JSON.stringify({ "jsondata":obj, "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  delCustom2(custom2) {
    var obj = [];
    for (var i = 0; i < custom2.length; i++) {
        obj.push({
        "custom2_id" : custom2[i],
        "insert_user":"iconic"}
        );      
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageCustom2/Custom2Manage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "delete","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  bulkUpdateCustom2(show, selectedlineItems, custom2s) {
    var obj = [];
    for (var i = 0; i < custom2s.length; i++) {
        if (selectedlineItems.indexOf(custom2s[i].custom2_id) >= 0) {
            obj.push(
            {
                "custom2":custom2s[i].custom2,
                "company_id":custom2s[i].company_id,
                "show_in_filter":show,
                "insert_user":"iconic",
                "custom2_id" : custom2s[i].custom2_id
           });  
        }        
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageCustom2/Custom2Manage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
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
  saveVendor(vendor, vendorcode, costcenter, item_id, excemption, show_in_filter) {
    var obj = JSON.stringify([
    {"avatax_vendor_id":"1",
    "vendor_name":vendor,
    "vendor_code":vendorcode,
    "cost_center_id":costcenter,
    "item_id":item_id,
    "excemption_certificate_num" : excemption,
    "show_in_filter":show_in_filter,
    "company_id" : localStorage.getItem("seleCompany"),
    "insert_user":"iconic"}]);      
    return this.http.post<{statuscode: string, statusmessage: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageVendor/VendorManage', JSON.stringify({ "jsondata":obj, "optype": "set","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  getVendors() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageVendor/VendorManage', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"optype": "get", "jsondata":''}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  updateVendor(vendor) {
    var obj = JSON.stringify([
    {"avatax_vendor_id":vendor.avatax_vendor_id,
    "vendor_name":vendor.vendor_name,
    "vendor_code":vendor.vendor_code,
    "vendor_desc":vendor.vendor_desc,
    "cost_center_id":vendor.cost_center_id,
    "item_id":vendor.item_id,    
    "excemption_certificate_num":vendor.excemption_certificate_num,
    "company_id":vendor.company_id,
    "show_in_filter":vendor.show_in_filter,
    "insert_user":"iconic",
    "vendor_id" : vendor.vendor_id}]);      
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageVendor/VendorManage', JSON.stringify({ "jsondata":obj, "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  delVendor(vendors) {
    var obj = [];
    for (var i = 0; i < vendors.length; i++) {
        obj.push({
        "vendor_id" : vendors[i],
        "insert_user":"iconic"}
        );      
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageVendor/VendorManage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "delete","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  bulkUpdateVendor(show, selectedlineItems, vendors) {
    var obj = [];
    for (var i = 0; i < vendors.length; i++) {
        if (selectedlineItems.indexOf(vendors[i].vendor_id) >= 0) {
            obj.push(
            {"avatax_vendor_id":vendors[i].avatax_vendor_id,
            "vendor_name":vendors[i].vendor_name,
            "vendor_code":vendors[i].vendor_code,
            "vendor_desc":vendors[i].vendor_desc,
            "cost_center_id":vendors[i].cost_center_id,
            "item_id":vendors[i].item_id,    
            "excemption_certificate_num":vendors[i].excemption_certificate_num,
            "company_id":vendors[i].company_id,
            "show_in_filter":show,
            "insert_user":"iconic",
            "vendor_id" : vendors[i].vendor_id});  
        }        
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageVendor/VendorManage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  saveItem(itemcode, itemname, tax_code, purpose, show_in_filter) {
    var obj = JSON.stringify([
    {"avatax_item_id":"1",
    "item_code":itemcode,
    "item_name":itemname,
    "tax_code":tax_code,
    "item_desc":"",
    "purpose_id":purpose,
    "show_in_filter":show_in_filter,
    "company_id" : localStorage.getItem("seleCompany"),
    "insert_user":"iconic"}]);      
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageItem/ItemManage', JSON.stringify({ "jsondata":obj, "optype": "set","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  getItems() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageItem/ItemManage', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"optype": "get", "jsondata":''}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  updateItem(item) {
    var obj = JSON.stringify([
    {"avatax_item_id":item.avatax_item_id,
    "item_code":item.item_code,
    "item_name":item.item_name,
    "tax_code":item.tax_code,
    "item_desc":item.item_desc,
    "purpose_id":item.purpose_id,    
    "company_id":item.company_id,
    "show_in_filter":item.show_in_filter,
    "insert_user":"iconic",
    "item_id" : item.item_id}]);      
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageItem/ItemManage', JSON.stringify({ "jsondata":obj, "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  delItem(items) {
    var obj = [];
    for (var i = 0; i < items.length; i++) {
        obj.push({
        "item_id" : items[i],
        "insert_user":"iconic"}
        );      
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageItem/ItemManage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "delete","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  bulkUpdateItem(show, selectedlineItems, items) {
    var obj = [];
    for (var i = 0; i < items.length; i++) {
        if (selectedlineItems.indexOf(items[i].item_id) >= 0) {
            obj.push(
            {"avatax_item_id":items[i].avatax_item_id,
            "item_code":items[i].item_code,
            "item_name":items[i].item_name,
            "tax_code":items[i].tax_code,
            "item_desc":items[i].item_desc,
            "purpose_id":items[i].purpose_id,    
            "company_id":items[i].company_id,
            "show_in_filter":show,
            "insert_user":"iconic",
            "item_id" : items[i].item_id});  
        }        
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageItem/ItemManage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  saveTaxCode(taxCode, show_in_filter) {
    var obj = JSON.stringify([
    {
    "tax_code":taxCode,
    "company_id":localStorage.getItem("seleCompany"),
    "show_in_filter":show_in_filter,
    "insert_user":"iconic"}]);      
    return this.http.post<{statuscode: string,statusmessage: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageTaxCode/TaxCodeManage', JSON.stringify({ "jsondata":obj, "optype": "set","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  getTaxCodes() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageTaxCode/TaxCodeManage', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"optype": "get", "jsondata":''}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  updateTaxCode(tax) {
    var obj = JSON.stringify([
    {
    "tax_code":tax.tax_code,
    "company_id":tax.company_id,
    "show_in_filter":tax.show_in_filter,
    "insert_user":"iconic",
    "tax_id" : tax.tax_id
    }]);      
    return this.http.post<{statuscode: string, statusmessage: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageTaxCode/TaxCodeManage', JSON.stringify({ "jsondata":obj, "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  delTax(taxs) {
    var obj = [];
    for (var i = 0; i < taxs.length; i++) {
        obj.push({
        "tax_id" : taxs[i],
        "insert_user":"iconic"}
        );      
    }
    return this.http.post<{tatuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageTaxCode/TaxCodeManage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "delete","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  bulkUpdateTax(show, selectedlineItems, taxs) {
    var obj = [];
    for (var i = 0; i < taxs.length; i++) {
        if (selectedlineItems.indexOf(taxs[i].tax_id) >= 0) {
            obj.push(
            {
                "tax_code":taxs[i].tax_code,
                "company_id":taxs[i].company_id,
                "show_in_filter":show,
                "insert_user":"iconic",
                "tax_id" : taxs[i].tax_id
           });  
        }        
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageTaxCode/TaxCodeManage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  saveLocation(locationcode, address, city, region, postalcode, country, costcenter, purpose, show_in_filter) {
    var obj = JSON.stringify([
    {"location_code":locationcode,
    "address":address,
    "city":city,
    "region":region,
    "postal_code":postalcode,
    "country":country,
    "cost_center_id":costcenter,
    "purpose_id":purpose,
    "company_id" : localStorage.getItem("seleCompany"),
    "show_in_filter":show_in_filter,
    "destination_address_id": "",
    "insert_user":"iconic"}]);      
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageDestinationAddress/DestinationAddressManage', JSON.stringify({ "jsondata":obj, "optype": "set","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  getLocations() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageDestinationAddress/DestinationAddressManage', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"optype": "get", "jsondata":''}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  updateLocation(loca) {
    var obj = JSON.stringify([
    {"location_code":loca.location_code,
    "address":loca.address,
    "city":loca.city,
    "region":loca.region,
    "postal_code":loca.region,
    "country":loca.country,    
    "cost_center_id":loca.cost_center_id,
    "purpose_id":loca.purpose_id,
    "company_id":loca.company_id,
    "destination_address_id":loca.destination_address_id,
    "show_in_filter":loca.show_in_filter,
    "insert_user":"iconic"}]);      
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageDestinationAddress/DestinationAddressManage', JSON.stringify({ "jsondata":obj, "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  delLoc(locs) {
    var obj = [];
    for (var i = 0; i < locs.length; i++) {
        obj.push({
        "destination_address_id" : locs[i],
        "insert_user":"iconic"}
        );      
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageDestinationAddress/DestinationAddressManage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "delete","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  bulkUpdateLoc(show, selectedlineItems, locs) {
    var obj = [];
    for (var i = 0; i < locs.length; i++) {
        if (selectedlineItems.indexOf(locs[i].destination_address_id) >= 0) {
            obj.push({
            "location_code":locs[i].location_code,
            "address":locs[i].address,
            "city":locs[i].city,
            "region":locs[i].region,
            "postal_code":locs[i].region,
            "country":locs[i].country,    
            "cost_center_id":locs[i].cost_center_id,
            "purpose_id":locs[i].purpose_id,
            "company_id":locs[i].company_id,
            "destination_address_id":locs[i].destination_address_id,
            "show_in_filter":show,
            "insert_user":"iconic"});  
        }        
    }
    return this.http.post<{ statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageDestinationAddress/DestinationAddressManage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  getEntityUseCode() {
    return this.http.post<{usecodeslist:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/misc/GetEntityUseCodes', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  savePurpose(purpose, entity, show_in_filter) {
    var obj = JSON.stringify([
    {
    "avatax_purpose_id":"1",
    "purpose_desc" : purpose,
    "entity_use_code" : entity,
    "company_id":localStorage.getItem("seleCompany"),
    "show_in_filter":show_in_filter,
    "insert_user":"iconic"}]);      
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManagePurpose/PurposeManage', JSON.stringify({ "jsondata":obj, "optype": "set","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  getPurpose() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManagePurpose/PurposeManage', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"optype": "get", "jsondata":''}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  updatePur(pur) {
    var obj = JSON.stringify([
    {"avatax_purpose_id":pur.avatax_purpose_id,
    "purpose_desc":pur.purpose_desc,
    "entity_use_code":pur.entity_use_code,
    "value_to_use_in_avatax":pur.value_to_use_in_avatax,
    "purpose_notes":pur.purpose_notes,
    "show_in_filter":pur.show_in_filter,    
    "purpose_id":pur.purpose_id,   
    "company_id":localStorage.getItem("seleCompany"),    
    "insert_user":"iconic"}]);      
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManagePurpose/PurposeManage', JSON.stringify({ "jsondata":obj, "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  delPur(pur) {
    var obj = [];
    for (var i = 0; i < pur.length; i++) {
        obj.push({
        "purpose_id" : pur[i],
        "insert_user":"iconic"}
        );      
    }
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManagePurpose/PurposeManage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "delete","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  bulkUpdatePur(show, selectedlineItems, purs) {
    var obj = [];
    for (var i = 0; i < purs.length; i++) {
        if (selectedlineItems.indexOf(purs[i].purpose_id) >= 0) {
            obj.push(    
            {"avatax_purpose_id":purs[i].avatax_purpose_id,
            "purpose_desc":purs[i].purpose_desc,
            "entity_use_code":purs[i].entity_use_code,
            "value_to_use_in_avatax":purs[i].value_to_use_in_avatax,
            "purpose_notes":purs[i].purpose_notes,
            "show_in_filter":show,    
            "purpose_id":purs[i].purpose_id,
            "company_id":localStorage.getItem("seleCompany"),            
            "insert_user":"iconic"});  
        }        
    }
    return this.http.post<{ statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManagePurpose/PurposeManage', JSON.stringify({ "jsondata":JSON.stringify(obj), "optype": "update","companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  loadSettings() {
    return this.http.post<{jsondata:any}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageGeneralSettings/GeneralSettingsManage', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"),"optype": "get", "jsondata":''}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  formatDate() {
    var d = new Date();
    var month, day, year;
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('/');
   }   
  saveSettings(set) {      
    var opttype = "set";
    if (set.general_settings_id > 0) {
        opttype = "update"
    }
    set.logging_start_time = this.formatDate();
    set.insert_user = "iconic";
    return this.http.post<{statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ManageGeneralSettings/GeneralSettingsManage', JSON.stringify({ "jsondata":'['+JSON.stringify(set)+']', "optype": opttype,"companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
}

