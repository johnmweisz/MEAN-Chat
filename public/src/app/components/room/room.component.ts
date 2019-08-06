import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { Subscription } from 'rxjs';
import { Room } from '../../models/room';
import { Message } from '../../models/message';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {
  room: Room;
  message: Message;
  user:object;

  private _roomSub: Subscription;
  
  constructor(private RS: RoomService) { }

  ngOnInit() {
    this.RS.getRooms();
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.message = {user: this.user, message: ''};
    this._roomSub = this.RS.currentRoom.subscribe( room => this.room = room);
  }

  ngOnDestroy() {
    this._roomSub.unsubscribe();
  }

  updateRoom() {
    this.RS.updateRoom(this.room._id, this.message);
    this.message.message = "";
  }

}