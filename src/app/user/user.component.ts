import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../service/user.service";
import {UsersListComponent} from "../users-list/users-list.component";
import {NotificationService} from "../service/notification.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<UserComponent>,
              public userService: UserService,
              public notificationService :NotificationService
  ) {
  }

  ngOnInit(): void {
  }

  onClose() {
    this.userService.form.reset();
    this.userService.initializeFormGroup();
    this.dialogRef.close();
  }

  onSubmit() {
     if (this.userService.form.valid) {
    let id=this.userService.form.controls['id'].value;
    let user = this.userService.form.getRawValue();

       this.userService.updateUser(id,user).subscribe(data=>{
         console.log(data)
         this.userService.form.reset();
         this.userService.initializeFormGroup();
         this.notificationService.success(':: Submitted successfully');
         this.onClose();


       })

    }

   console.log( this.userService.form.getRawValue());
  }
  onClear() {
    this.userService.form.reset();
    this.userService.initializeFormGroup();
  }
}
