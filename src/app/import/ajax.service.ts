import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AjaxService {
  constructor(private http: HttpClient) {}
  getAllTemplates() {
    return this.http.post<{importtemplates: {}[]}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Template/GetImportTemplates', JSON.stringify({ "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  getHelps(selectedTemplate) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Template/GetTemplateHelpText', JSON.stringify({ "templateid": selectedTemplate}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  getHistories(fromd, tod) {
    return this.http.post<{importhistory: [2]}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Template/GetImportHistory', JSON.stringify({ "companyid": localStorage.getItem("seleCompany"), "userid": localStorage.getItem("userId"), "fromdate": fromd, "todate": tod }), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  uploadFile(json) {
    return this.http.post('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ImportFile/UploadDataFile', json, {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  downloadTemplate(selectedTemplate) {
    return this.http.post<{filecontent:'', statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ImportFile/GetImportFileTemplate', JSON.stringify({ "templateid": selectedTemplate, "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  downloadError(argImportId) {
    return this.http.post<{filecontent:'', statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ImportFile/GetImportRejectedData', JSON.stringify({ "importid": argImportId, "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  } 
  downloadSource(argImportId) {
    return this.http.post<{fileUrl:'', statuscode: number, filename: ''}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ImportFile/GetImportSourceFile', JSON.stringify({ "importid": argImportId, "companyid": localStorage.getItem("seleCompany")}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }
  deleteSource(argImportId, comments) {
    return this.http.post<{fileUrl:'', statuscode: number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/ImportFile/DeleteImportHistory', JSON.stringify({ "importid": argImportId, "comment":comments, "username": "iconic"}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
}
