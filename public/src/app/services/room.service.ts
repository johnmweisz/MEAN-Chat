import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Room } from '../models/room';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  currentRoom = this.socket.fromEvent<Room>('ChatRoom');
  rooms = this.socket.fromEvent<Room[]>('ChatRooms');
  roomId:string;
  messages:string[];
  message:object;

  constructor(private socket: Socket) {}

  joinRoom(id: string) {
    this.socket.emit('joinRoom', id);
  }

  removeRoom(id: string) {
    this.socket.emit('removeRoom', id);
  }

  newRoom(name, user) {
    this.socket.emit('addRoom', {
      name: name,
      admins: [user],
      messages: [{user: {first_name: 'server'}, message: `welcome to ${name}`}]
    });
  }

  updateRoom(roomId:string, message: Message) {
    this.socket.emit('updateRoom', {roomId: roomId, message: message});
  }

  getRooms() {
    this.socket.emit('getRooms');
  }
  
}
