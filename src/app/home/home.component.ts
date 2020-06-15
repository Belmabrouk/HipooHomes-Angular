import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {PropertyService} from "../service/property.service";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {Property} from "../models/property";
import {Router} from "@angular/router";
import {DOCUMENT} from "@angular/common";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit , OnDestroy {
  public provinceEnum = Province;
  filteredOptions: Observable<any[]>;
  selectedProvince = null;
  enumKeyValues = [];
listPropertyByProvince : Object;

  constructor(public propertyService: PropertyService ,
              public  router : Router,
              @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.document.body.classList.add('transparent-header')
   Object.entries(this.provinceEnum).forEach(([key, value]) => this.enumKeyValues.push({key : key, value : value}));



  }


  onSearch(province){
    let prov = province.searchInput.key
    this.router.navigateByUrl("/properties/"+prov )

  }

  ngOnDestroy(): void {
    this.document.body.classList.remove('transparent-header')
  }


}
export enum Province {

  Álava ="Álava"  ,
  A_Coruña= "A Coruña",
  Alicante ="Alicante"  ,
  Almería ="Almería"  ,
  Asturias ="Asturias"  ,
  Ávila ="Ávila"  ,
  Badajoz ="Badajoz"  ,
  Baleares ="Baleares"  ,
  Barcelona ="Barcelona"  ,
  Burgos ="Burgos"  ,
  Cáceres ="Cáceres"  ,
  Cádiz ="Cádiz"  ,
  Cantabria ="Cantabria"  ,
  Castellón ="Castellón"  ,
  Ciudad_Real ="Ciudad Real"  ,
  Córdoba ="Córdoba"  ,
  Cuenca ="Cuenca"  ,
  Girona ="Girona"  ,
  Granada ="Granada"  ,
  Guadalajara ="Guadalajara"  ,
  Gipuzkoa ="Gipuzkoa"  ,
  Huelva ="Huelva"  ,
  Huesca ="Huesca"  ,
  Jaén ="Jaén"  ,
  La_Rioja ="La Rioja"  ,
  Las_Palmas ="Las Palmas"  ,
  León ="León"  ,
  Lérida ="Lérida"  ,
  Lugo ="Lugo"  ,
  Madrid ="Madrid"  ,
  Málaga ="Málaga"  ,
  Murcia ="Murcia"  ,
  Navarra ="Navarra"  ,
  Ourense ="Ourense"  ,
  Palencia ="Palencia"  ,
  Pontevedra ="Pontevedra"  ,
  Salamanca ="Salamanca"  ,
  Segovia ="Segovia"  ,
  Sevilla ="Sevilla"  ,
  Soria ="Soria"  ,
  Tarragona ="Tarragona"  ,
  Santa_Cruz_de_Tenerife ="Santa Cruz de Tenerife"  ,
  Teruel ="Teruel"  ,
  Toledo ="Toledo"  ,
  Valencia ="Valencia"  ,
  Valladolid ="Valladolid"  ,
  Vizcaya ="Vizcaya"  ,
  Zamora ="Zamora"  ,
  Zaragosza ="Zaragosza"

}
