import { Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { Subscription } from 'rxjs';
import { Room } from '../../models/room';
import { Message } from '../../models/message';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy {
  @ViewChild('autoDown', {static: true}) chatWindow: ElementRef;
  room: Room;
  message: Message;
  user: object;
  private _roomSub: Subscription;

  constructor(private RS: RoomService) { }

  ngOnInit() {
    this.RS.getRooms();
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.message = {user: this.user, message: ''};
    this._roomSub = this.RS.currentRoom.subscribe( room => this.room = room);
  }

  ngAfterViewInit() {
    this.scrollBottom();
  }

  ngAfterViewChecked() {
    this.scrollBottom();
  }

  updateRoom() {
    this.RS.updateRoom(this.room._id, this.message);
    this.message.message = '';
  }

  scrollBottom() {
    this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
  }

  ngOnDestroy() {
    this._roomSub.unsubscribe();
  }

}
