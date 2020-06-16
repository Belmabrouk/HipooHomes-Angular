import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Property} from "../models/property";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  host: string = "http://localhost:8080/";
  listPropertySearch :any;
  constructor(private http:HttpClient) { }

  getPropertiesByProvince (province : string) : Observable<any>
  {    return this.http.get(this.host+"properties/"+province)
  }

  getCoordinatesByProvince(province : string)
  {    return this.http.get(this.host+"getCoordinatesByProvince/"+province)
  }

  getPropertyById(id){
    return this.http.get(this.host+"properties/property/"+id)
  }

  bookProperty(username,propertyId){

    return this.http.put(this.host+"bookProperty/"+username+"/"+propertyId,'',{observe: 'response'})
  }

  addFavourite(username,propertyId){

    return this.http.put(this.host+"addFavourite/"+username+"/"+propertyId,'',{observe: 'response'})
  }

  propertyCount()
  {
    return this.http.get(this.host+'propertyCount',{observe:"response"})
  }

  getRelatedProperties(id){
    return this.http.get(this.host+"properties/relatedProperties/"+id)
  }
}
