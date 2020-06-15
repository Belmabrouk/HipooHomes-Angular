import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {UsersListComponent} from "./users-list/users-list.component";
import {PropertyListComponent} from "./property-list/property-list.component";
import {PropertyDetailsComponent} from "./property-details/property-details.component";
import {ChatComponent} from "./chat/chat.component";
import {AdminInboxComponent} from "./admin-inbox/admin-inbox.component";


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '',   redirectTo: 'home', pathMatch: 'full' },
  { path: 'dashboard',   component: DashboardComponent },
  { path: 'dashboard/userList',   component: UsersListComponent },
  { path: 'properties/:province',   component: PropertyListComponent },
  { path: 'properties/:province/:id',   component: PropertyDetailsComponent },
  { path: 'chat',   component: ChatComponent },
  { path: 'dashboard/inbox',   component: AdminInboxComponent }





];

@NgModule({
  imports: [RouterModule.forRoot(routes),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
