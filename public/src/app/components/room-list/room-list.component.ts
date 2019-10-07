import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit, OnDestroy {
  rooms: Observable<Room[]>;
  room: object;
  user: object;

  private _roomSub: Subscription;

  constructor(
    private RS: RoomService,
    private mainChat: ChatComponent
    ) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.rooms = this.RS.rooms;
    this._roomSub = this.RS.currentRoom.subscribe(room => {
      this.room = room;
      this.mainChat.roomName = room.name;
    });
  }

  ngOnDestroy() {
    this._roomSub.unsubscribe();
  }

  joinRoom(id: string) {
    this.RS.joinRoom(id, this.user['first_name']);
  }

  removeRoom(id: string, admins: []) {
    if (this.isAdmin(admins)) {
      this.RS.removeRoom(id);
      return;
    }
  }

  isAdmin(admins: []) {
    for (let admin of admins){
      if (this.user['_id'] == admin['_id']) {
        return true;
      }
      return false;
    }
  }

  isJoined(id: string) {
    if (this.room) {
      if (this.room['_id'] == id){
        return true;
      }
      return false;
    }
    return false;
    }

}
