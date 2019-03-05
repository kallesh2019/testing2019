import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) {} 
  login (username, password) {      
    return this.http.post<{"statuscode":any,"userid": number}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Account/AuthenticateUser', JSON.stringify({ "username": username, "password": password}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
  GetCompaniesByUser(userId) {
    return this.http.post<{"companylist":[{companyid:'',companyname:''}]}>('https://1kh39vma1c.execute-api.us-east-1.amazonaws.com/Prod/api/Account/GetCompanyListByUser', JSON.stringify({ "userid": userId}), {
    'headers' : {
        'Content-Type' : 'application/json; charset=utf-8'
    }});
  }  
}
