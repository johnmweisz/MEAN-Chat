import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email:string;
  password:string;
  user:User;
  errors:object[];
  loggedIn:boolean;

  constructor(    
    private _route: ActivatedRoute,
    private _router: Router, 
    private US: UserService,
    private mainComp: AppComponent //main component that will control the header
    ) { }

  ngOnInit() {
  }

  login(){
    const try_user = {
      email: this.email,
      password: this.password,
    }
    this.US.login(try_user)
      .subscribe(user => {
        if (user['errors']) {
          this.errors = user['errors'];
        } else {
          user['password'] = ""; //clears hashed password before saving to session
          this.errors = [];
          sessionStorage.setItem('user', JSON.stringify(user));
          this.mainComp.loggedIn = true;
          this._router.navigate(['chat']);
        }
      });
  }

}
