import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Message} from '../models/Message'
import { Observable, throwError } from 'rxjs';

import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  url: string = "http://localhost:8080/socket";

  constructor(private http: HttpClient) { }

  post(data: Message) {
    return this.http.post(this.url, data).pipe(map((data: Message) => { return data; })
     , catchError(error => {
        return throwError(error);
      })
      )

  }
}
