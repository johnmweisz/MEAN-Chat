import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  first_name: string;
  last_name:string;
  email:string;
  password:string;
  user:User;
  errors:object[];

  constructor(    
    private _route: ActivatedRoute,
    private _router: Router, 
    private US: UserService
    ) { }

  ngOnInit() {
  }

  register(){
    const new_user = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      password: this.password,
    }
    this.US.register(new_user)
      .subscribe(user => {
        if (user['errors']) {
          this.errors = user['errors'];
        } else {
          user['password'] = ""; //clears hashed password before saving to session
          this.errors = [];
          sessionStorage.setItem('user', JSON.stringify(user));
          console.log(JSON.parse(sessionStorage.getItem('user')));
          this._router.navigate(['chat']);
        }
      });
  }

}
