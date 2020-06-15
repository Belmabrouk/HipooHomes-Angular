import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user";
import {Observable} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  host: string = "http://localhost:8080/";
  selectedProperty : boolean;
  constructor(private http : HttpClient) { }


  getUsersCount(){
    return this.http.get(this.host+"usersCount",{observe:"response"})

  }

  getAllUsers() {

    return this.http.get(this.host+"usersList",{observe : "response"});
  }

  deleteUser(id : string) {
    let url = "http://localhost:8080/deleteUser/"+id;
    console.log(url)
    return this.http.delete(url);
  }

  updateUser(id, data) {
    let url = "http://localhost:8080/updateUser/"+id;
    return this.http.put(url, data);
  }

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    username: new FormControl({value:'',disabled:true}),
    password: new FormControl(''),
    role: new FormControl(
      {
        value: '',
        disabled:true
      }
    ),
    email: new FormControl(
      {
        value: '',
      },
      [
        Validators.required,
        Validators.email
      ]
    ),
    selectedProperty: new FormControl(
      {
        value: '',
        disabled: true
      },
      [
        Validators.required,

      ]
    ),
    property: new FormControl(
      {
        value: '',
        disabled: true
      },
      [
        Validators.required,

      ]
    )
  });

  initializeFormGroup() {
    this.form.setValue({
      id:'',
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      role:'',
      password:'',
      selectedProperty: false,
      property: ''
    });
  }

  populateForm(user) {
    this.selectedProperty = user.selectedProperty;
    this.form.setValue(user);
  }
}
