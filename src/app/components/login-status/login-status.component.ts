import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated?: boolean = false;
  userFullName?: string = "";

  storage: Storage = sessionStorage;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth,private authStateService: OktaAuthStateService) { }

  ngOnInit(): void {
    this.oktaAuth.authStateManager.subscribe(
      (result:any)=>{
        this.isAuthenticated = result
        this.getUserDetails()
      }
    )
  }

  public getUserDetails() {
    if(this.isAuthenticated){
      //fetch the logged in user details(user's claim)
      //
      //user full name is expressed as a property name
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name;

          //reterieve the users email from authetication response
          const theEmail = res.email;

          //now store the email in browser
          this.storage.setItem('userEmail',JSON.stringify(theEmail));
        }
      );
    }
  }

  public logout(){
    //terminates the session with okta adn remove the current tokens
    this.oktaAuth.signOut();
  }

}
