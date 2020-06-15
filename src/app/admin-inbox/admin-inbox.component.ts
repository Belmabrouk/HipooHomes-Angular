import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Message} from "../models/Message";


import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-admin-inbox',
  templateUrl: './admin-inbox.component.html',
  styleUrls: ['./admin-inbox.component.css']
})
export class AdminInboxComponent implements OnInit , AfterViewInit{

  /*
  Chat inbox
   */

  private serverUrl = 'http://localhost:8080/socket';
  isLoaded: boolean = false;
  isCustomSocketOpened = false;
  private stompClient;
  form: FormGroup;

  messages: Message[] = [];
  time: number = Date.now();
  from = 'admin'

  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      message: new FormControl(null, [Validators.required])
    })
    this.initializeWebSocketConnection();


  }

  ngAfterViewInit(): void {

  }

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {

      that.openGlobalSocket()
    });
  }

  openGlobalSocket() {
    this.stompClient.subscribe("/socket-publisher/"+this.from, (message) => {
      this.handleResult(message);
    });
  }

  handleResult(message){
    if (message.body) {
      let messageResult: Message = JSON.parse(message.body);
      console.log(messageResult);
      this.messages.push(messageResult);
      this.isLoaded = true;
      console.log(this.messages);
    }
  }

  sendMessageUsingSocket(username) {
    console.log(this.form.value)
    if (this.form.valid) {
      let message: Message = { message: this.form.value.message, fromId: 'admin', toId: username };
      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(message));
    }
  }

  msgRecieved(){
    return (this.messages != [])
  }
}
