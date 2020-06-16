import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PropertyService} from "../service/property.service";
import {Property} from "../models/property";
import {NotificationService} from "../service/notification.service";
import {DecimalPipe, ViewportScroller} from "@angular/common";
import {FormBuilder, FormGroup} from "@angular/forms";
import * as L from 'leaflet';
import {GestureHandling} from "leaflet-gesture-handling";
import {SwiperConfigInterface} from "ngx-swiper-wrapper";
import {SwiperOptions} from "swiper";

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit, AfterViewInit {


  constructor(public route: ActivatedRoute,
              public propertyService: PropertyService,
              public notifService: NotificationService,
              public fb: FormBuilder,
              private _decimalPipe: DecimalPipe
  ) {
  }

  id: string;
  property;
  relatedProperty;
  imageArray: any;

  //Calculator
  formCalculator: FormGroup;
  monthlyPayment;
  taxes: number
  pricePlustaxes: number;

  // property map
  map;
  smallIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  ngOnInit(): void {

  //Getting property id from URI
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id)

    });
    // Get property details
    this.propertyService.getPropertyById(this.id).subscribe(res => {
      this.property = res;
      this.imageArray = [{image: this.property.thumbnail, thumbImage: this.property.thumbnail},
        {image: this.property.thumbnail, thumbImage: this.property.thumbnail},
        {image: this.property.thumbnail, thumbImage: this.property.thumbnail},
        {image: this.property.thumbnail, thumbImage: this.property.thumbnail},
        {image: this.property.thumbnail, thumbImage: this.property.thumbnail}]
      console.log(this.property)
      this.taxes=this.property.price * 0.0625;
      this.pricePlustaxes = this.property.price + this.taxes
    })


    // form calculator
    this.formCalculator = this.fb.group({
      downPayment: [100000],
      interestRate: [2],
      loanTerm: [25]
    });
    this.onChanges();

    //get related products
    this.propertyService.getRelatedProperties(this.id).subscribe(res => {
      this.relatedProperty = res;
     console.log("related property : ")
      console.log(this.relatedProperty)

    })



  }

  ngAfterViewInit(): void {
    this.createMap();
  }

  onChanges(): void {
    this.formCalculator.valueChanges.subscribe(val => {
    const principal : number = this.pricePlustaxes - val.downPayment;
    const r : number = val.interestRate/1200;
    const n : number = val.loanTerm * 12;
    const numerator = r*((1+r)**n);
    const denumerator = ((1+r)**n)-1;
    const monthlyQuota = principal*numerator/denumerator;
    this.monthlyPayment = (new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(monthlyQuota));
    console.log(this.monthlyPayment)
    });
  }

  onBookProperty(propertyId) {
    const username = localStorage.getItem('username');
    this.propertyService.bookProperty(username, propertyId).subscribe(res => {

      this.notifService.success("Property Booked Successfully")
    }, error => {
      console.log(error)
      this.notifService.warn("Already Booked a Property !!")
    })
  }

  bookmarkProperty(propertyId) {
    const username = localStorage.getItem('username');
    this.propertyService.addFavourite(username, propertyId).subscribe(res => {

      this.notifService.success("Property Bookmarked")
    }, error => {
      console.log(error)
      this.notifService.warn("Property already Bookmarked !!")
    })
  }


   createMap() {
    const zoomLevel = 15;
    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
    this.map = L.map('map1', {
      center: [this.property.latitude, this.property.longitude],
      zoom: zoomLevel,
      zoomControl: false,
      gestureHandling: true


    });

    const minLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    minLayer.addTo(this.map);
    const marker = L.marker([this.property.latitude, this.property.longitude], {icon: this.smallIcon});
    marker.addTo(this.map);



  }



}
