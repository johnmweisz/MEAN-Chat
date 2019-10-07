import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  roomName: string;

  constructor() { }

  ngOnInit() {
    this.roomName = 'Please select a room';
  }

}
