import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  host: string = "http://localhost:8080/";
  jwt : string;
  username: string;
  role : Array<string>;
  constructor(private http:HttpClient) { }

  login(data)
  {
    return this.http.post(this.host+"login",data,{observe:"response"})
  }

  saveToken(jwt) {
    localStorage.setItem("token",jwt);
    this.jwt=jwt;
    this.parseJWT()
  }

  parseJWT(){

    let jwtHelper = new JwtHelperService();
    if(this.jwt!= null){
    let jwtObject = jwtHelper.decodeToken(this.jwt);
    this.username = jwtObject.sub;
    localStorage.setItem('username',this.username);
    console.log("username : "+this.username)
    this.role= jwtObject.roles;
      console.log("role : "+this.role)
  }
  }

  isAdmin(){
if(this.role != null){
    return this.role[0]=="ADMIN";
  }
  }


  isUser() {
    if (this.role != null) {

      return this.role[0] == "USER";
    }
  }

  isAuthenticated(){

    return this.role!=undefined;
  }
  loadToken(){
    this.jwt= localStorage.getItem('token');
    this.parseJWT();
    return this.username;

  }
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('username')
    this.initParams();
  }
  initParams(){
    this.jwt=undefined;
    this.username=undefined;
    this.role=undefined;
  }

  register(user ){
    return this.http.post(this.host+"register",user,{observe:"response"})
  }

}
