import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-room-add',
  templateUrl: './room-add.component.html',
  styleUrls: ['./room-add.component.css']
})
export class RoomAddComponent implements OnInit {
  name: string;
  rooms: Observable<Room[]>;
  roomId: string;
  user: object;

  constructor(
    private RS: RoomService,
    private mainChat: ChatComponent
    ) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  newRoom() {
    this.RS.newRoom(this.name, this.user);
    this.mainChat.roomName = this.name;
    this.name = '';
  }

}
