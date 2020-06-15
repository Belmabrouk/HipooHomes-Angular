import { Component, OnInit } from '@angular/core';
import {UserService} from "../service/user.service";
import {PropertyService} from "../service/property.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private userService : UserService,
              private propertyService : PropertyService) { }

  usersCount ;
  propertyCount;
  ngOnInit(): void {
    this.userService.getUsersCount().subscribe(data=>{
      this.usersCount=data.body.toString();
    })

    this.propertyService.propertyCount().subscribe(data=>{
      this.propertyCount=data.body.toString();
    })
  }

}
