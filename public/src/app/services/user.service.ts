import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  register(body){
    return this._http.post('/user/register', body);
  }
  
  login(body){
    return this._http.post(`/user/login`, body);
  }

}
