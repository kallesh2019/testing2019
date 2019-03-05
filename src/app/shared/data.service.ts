import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  private loginBehaviour = new BehaviorSubject(null);

  private dataBehaviour = new BehaviorSubject({});
  
  loginChangeStatus = this.loginBehaviour.asObservable();
    
  dataChangeStatus = this.dataBehaviour.asObservable();

  constructor() {
  }

  loginStatus(message) {
    this.loginBehaviour.next(message);
  }
  companyData(message) {
    this.dataBehaviour.next(message);
  }
}
