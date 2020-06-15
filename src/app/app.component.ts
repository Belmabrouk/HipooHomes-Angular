import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./service/authentication.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "./models/user";
import {Router} from "@angular/router";
import {NotificationService} from "./service/notification.service";
import {Message} from "./models/Message";
import {SocketService} from "./service/socket.service";


import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'HipooHomes';
  badCredentials: boolean;

  constructor(private authService: AuthenticationService,
              private formBuilder: FormBuilder,
              private  router : Router,
              private  notifService : NotificationService,
              private socketService: SocketService
  ) {
  }

  username: string;
  user : User;

  /*
  Chat pop-up
   */

  private serverUrl = 'http://localhost:8080/socket';
  isLoaded: boolean = true;
  isCustomSocketOpened = false;
  private stompClient;
  form: FormGroup;

  messages: Message[] = [];
  from = localStorage.getItem('username');

  ngOnInit(): void {
    this.username = this.authService.loadToken();
    console.log(this.authService.isAdmin())
    this.form = new FormGroup({
      message: new FormControl(null, [Validators.required])
    })
    this.initializeWebSocketConnection();
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

  handleResult(message){
    if (message.body) {
      let messageResult: Message = JSON.parse(message.body);
      console.log(messageResult);
      this.messages.push(messageResult);

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

  sendMessageUsingSocket() {
    console.log(this.form.value)
    if (this.form.valid) {
      let message: Message = { message: this.form.value.message, fromId: this.username, toId: 'admin' };
      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(message));
    }
  }

  onLogin(data) {
    console.log(data);

    this.authService.login(data).subscribe(res => {
      let jwt = res.headers.get("Authorization");
      this.authService.saveToken(jwt);



      if(this.authService.role[0] == "ADMIN"){

        location.assign('/dashboard');
      }
      else {
        location.assign('/home');
      }

          },
        err=>{
        this.badCredentials = true;

    })
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  logout() {
    location.assign('/home');
    return this.authService.logout();


  }

  onRegister(data) {
    this.user = new User();
  this.user.firstName= data.firstname;
  this.user.lastName=data.lastname;
  this.user.email=data.email;
  this.user.password=data.passwords.password1;
    this.authService.register(this.user).subscribe(res => {
      let body = res.body
      let loginData = {
        username : body['username'],
        password  : data.passwords.password1

      }
      this.onLogin(loginData);
    })


  }

  isUser() {
    return this.authService.isUser();
  }
}


