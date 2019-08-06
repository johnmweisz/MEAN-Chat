import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoomService } from './services/room.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loggedIn:boolean;

  constructor(private RS: RoomService) { }

  ngOnInit() {
    this.islogged();
  }

  logout(){
    sessionStorage.removeItem('user');
    this.islogged();
  }

  islogged(){
    if (sessionStorage.getItem('user') == null){
      this.loggedIn = false;
    } else {
      this.loggedIn = true;
    }
  }

}
