import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { Message } from '../models/message';
import {SocketService} from "../service/socket.service";

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private serverUrl = 'http://localhost:8080/socket';
  isLoaded: boolean = true;
  isCustomSocketOpened = false;
  private stompClient;
   form: FormGroup;
   userForm: FormGroup;
  messages: Message[] = [];
  username = localStorage.getItem('username');
  constructor(private socketService: SocketService  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      message: new FormControl(null, [Validators.required])
    })
    this.userForm = new FormGroup({
      fromId: new FormControl(null, [Validators.required]),
      toId: new FormControl(null)
    })
    this.initializeWebSocketConnection();
  }

  sendMessageUsingSocket() {
    console.log(this.form.value)
    if (this.form.valid) {
      let message: Message = { message: this.form.value.message, fromId: this.username, toId: 'admin' };
      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(message));
    }
  }

   openForm() {

    document.getElementById("myForm").style.display = "block";

     this.isCustomSocketOpened = true;
     this.stompClient.subscribe("/socket-publisher/"+this.username, (message) => {
       this.handleResult(message);
     });
  }

   closeForm() {
    document.getElementById("myForm").style.display = "none";
  }


  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      that.isLoaded = true;
      that.openGlobalSocket()
    });
  }

  openGlobalSocket() {
    this.stompClient.subscribe("/socket-publisher", (message) => {
      this.handleResult(message);
    });
  }

  openSocket() {
    if (this.isLoaded) {

    }
  }

  handleResult(message){
    if (message.body) {
      let messageResult: Message = JSON.parse(message.body);
      console.log(messageResult);
      this.messages.push(messageResult);

    }
  }


}
