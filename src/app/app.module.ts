import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {DecimalPipe, registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule,ReactiveFormsModule} from "@angular/forms";
import { CheckPasswordDirective } from './helpers/check-password.directive';
import { DashboardComponent } from './dashboard/dashboard.component';
import {JWTInterceptor} from "./helpers/jwt.interceptor";
import { UsersListComponent } from './users-list/users-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatFormField, MatFormFieldModule, MatSuffix} from "@angular/material/form-field";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { UserComponent } from './user/user.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatGridList, MatGridListModule} from "@angular/material/grid-list";
import {MatSlideToggle, MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSnackBar, MatSnackBarConfig, MatSnackBarModule} from "@angular/material/snack-bar";
import { PropertyListComponent } from './property-list/property-list.component';
import {MatAutocomplete, MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatOption, MatOptionModule} from "@angular/material/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgxPaginationModule} from "ngx-pagination";
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { NgImageSliderModule } from 'ng-image-slider';
import {RouterModule} from "@angular/router";
import {NgxSliderModule} from "@m0t0r/ngx-slider";
import {MatSelectModule} from "@angular/material/select";
import {MatAccordion, MatExpansionModule} from "@angular/material/expansion";
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import {ChatComponent} from "./chat/chat.component";
import {AdminInboxComponent} from "./admin-inbox/admin-inbox.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CheckPasswordDirective,
    DashboardComponent,
    UsersListComponent,
    UserComponent,
    PropertyListComponent,
    PropertyDetailsComponent,
    ChatComponent,
    AdminInboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatOptionModule,
    NgSelectModule,
    NgxPaginationModule,
    NgImageSliderModule,
    RouterModule,
    NgxSliderModule,
    MatSelectModule,
    MatExpansionModule,
    MatCheckboxModule,






  ],
  providers: [ {provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi:true},
    { provide: LOCALE_ID, useValue: 'fr-FR'}, DecimalPipe],
  bootstrap: [AppComponent],
  entryComponents: [UserComponent]
})
export class AppModule { }
