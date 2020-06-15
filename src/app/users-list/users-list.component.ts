import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../service/user.service";
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../models/user";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {UserComponent} from "../user/user.component";
import {NotificationService} from "../service/notification.service";


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  constructor(private userService: UserService,
              private dialog: MatDialog,
              private  notificationService: NotificationService
  ) {
  }

  listData: any = new MatTableDataSource()
  displayedColumns: string[] = ['firstName', 'lastName', 'username', 'email', 'actions'];
  userArray: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(res => {

      this.userArray = res.body as User[];
      console.log(this.userArray)
// Assign the data to the data source for the table to render
      this.listData = new MatTableDataSource(this.userArray as User[]);
      console.log(this.listData)
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
        });
      };

    })

  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }


  onDelete(row: any) {
    console.log(row.id)
    if (confirm("Do you want to delete this user")) {
      this.userService.deleteUser(row.id).subscribe(res => {
        console.log("user " + row.username + " deleted")
        this.notificationService.success(':: Submitted successfully');

      })
      this.ngOnInit();
    }
  }

  onUpdate(row) {
    console.log(row);
    this.userService.populateForm(row);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    this.dialog.open(UserComponent, dialogConfig).afterClosed()
      .subscribe(() =>
        this.userService.getAllUsers().subscribe(res => {

          this.userArray = res.body as User[];
          console.log(this.userArray)
// Assign the data to the data source for the table to render
          this.listData = new MatTableDataSource(this.userArray as User[]);
          console.log(this.listData)
          this.listData.sort = this.sort;
          this.listData.paginator = this.paginator;
          this.listData.filterPredicate = (data, filter) => {
            return this.displayedColumns.some(ele => {
              return ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
            });
          };

        }));
  }
}
