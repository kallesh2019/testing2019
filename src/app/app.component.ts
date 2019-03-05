import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor () {}
  userIsLogged () {
        if (sessionStorage.currentUser) {
            return true;
        }      
  }
}