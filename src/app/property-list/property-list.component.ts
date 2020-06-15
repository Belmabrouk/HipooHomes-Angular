import {Component, OnInit, AfterViewInit} from '@angular/core';
import {PropertyService} from "../service/property.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as L from 'leaflet';
import {GestureHandling} from "leaflet-gesture-handling";
import {formatCurrency, formatNumber} from "@angular/common";
import {Options, LabelType} from '@m0t0r/ngx-slider';
import {FormBuilder, FormGroup, FormArray, FormControl, Validators} from '@angular/forms';
import {min} from "rxjs/operators";
import * as ts from "typescript";

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})

export class PropertyListComponent implements OnInit, AfterViewInit {
  listPropertyByProvince: any;
  listPropertyFiltered: any;
  sub: any;
  prov: string;

  //pagination
  totalRecords: any;
  currentPage = 1;

  //property status options
  selectOptions = [
    {
      value: "all",
      name: "All"
    },
    {
      value: "newdevelopment",
      name: "New"
    },
    {
      value: "good",
      name: "good"
    },
    {
      value: "renew",
      name: "need renovation"
    }
  ]

  //Amenities options
  amenitiesOptions = [
    {
      value: "haslift",
      name: "Elavator"
    },
    {
      value: "AC",
      name: "Air conditionning"
    },
    {
      value: "fittedWardrobe",
      name: "Fitted Wardrobe"
    },
    {
      value: "garden",
      name: "Garden"
    },
    {
      value: "pool",
      name: "Pool"
    },
    {
      value: "garage",
      name: "Garage"
    }
  ]

  //Price Slider options
  minValue: number = 0;
  maxValue: number = 2000000;
  options: Options = {
    floor: 0,
    ceil: 2000000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min price:</b> €' + value;
        case LabelType.High:
          return '<b>Max price:</b> €' + value;
        default:
          return '€' + value;
      }
    }

  };

  //size Slider options
  minSize: number = 0;
  maxSize: number = 2000;
  sizeOptions: Options = {
    floor: 0,
    ceil: 2000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min size:</b> ' + value + 'm²';
        case LabelType.High:
          return '<b>Max size:</b> ' + value + 'm²';
        default:
          return value + '²';
      }
    }

  };

  //Rooms slider options
  roomsValue: number = 4;
  roomOptions: Options = {
    showTicksValues: true,
    stepsArray: [
      {value: 0},
      {value: 1},
      {value: 2},
      {value: 3},
      {value: 4},

    ]
  };

  //bathRooms slider options
  bathroomValue: number = 2;
  bathroomOptions: Options = {
    showTicksValues: true,
    stepsArray: [
      {value: 0},
      {value: 1},
      {value: 2},
      {value: 3},
      {value: 4},

    ]
  };

  form: FormGroup;

  constructor(public propertyService: PropertyService,
              public route: ActivatedRoute,
              public router: Router,
              private fb: FormBuilder) {
    this.form = this.fb.group({
      status: [''],
      price: [''],
      size: [''],
      rooms: [''],
      bathrooms: [''],
      checkArray: this.fb.array([])
    })
  }

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
  provinceCoordinates: any;

  ngAfterViewInit(): void {
    this.propertyService.getCoordinatesByProvince(this.prov).subscribe(res => {
      this.provinceCoordinates = res;
      console.log(this.provinceCoordinates)
      this.createMap(this.provinceCoordinates);
    })


  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.prov = params['province'];
    });
    this.propertyService.getPropertiesByProvince(this.prov).subscribe(res => {

      this.listPropertyByProvince = res
      this.listPropertyFiltered = this.listPropertyByProvince;
      this.totalRecords = this.listPropertyFiltered.length
      console.log(this.listPropertyFiltered);

    })


  }

  createMap(provinceCoordinates) {
    console.log(provinceCoordinates.latitude)

    const zoomLevel = 13;
    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
    this.map = L.map('map1', {
      center: [provinceCoordinates.latitude, provinceCoordinates.longitude],
      zoom: zoomLevel,
      zoomControl: false,
      gestureHandling: true


    });

    const minLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    minLayer.addTo(this.map);
    let retiroCoordinates = {
      latitude: 40.415260,
      longitude: -3.684500
    }
    console.log(this.listPropertyByProvince)
    this.listPropertyByProvince.forEach(property => {
      //  property.price = property.price
      this.addMarker(property);
    })

  }

  addMarker(property) {
    const propertyUrl = "/properties/" + property.province + "/" + property.id;
    var customPopup = "<div class='image'><a href=" + propertyUrl + "><img src=" + property.thumbnail + " alt='maptime logo gif' width='100%' height='100%'/> <h2>\n" +
      "<span>" + property.price + " €<span class='spacer'></span><br /><span ></span>" + property.title + "</span> <!-- span tag to beautify it efficiently -->\n" +
      "</h2></a></div>";

// specify popup options
    var customOptions =
      {
        'maxWidth': 400,
        'width': '200',
        'className': 'popupCustom'
      }
    const marker = L.marker([property.latitude, property.longitude], {icon: this.smallIcon});
    marker.addTo(this.map).bindPopup(customPopup, customOptions);
  }

  OnpropertyDetails(id) {

    console.log(this.prov)
    console.log(id)
    this.router.navigateByUrl("/properties/" + this.prov + "/" + id)
  }


  onFilter(value: any) {
    console.log(value);
    console.log(value.rooms);
    console.log(value.toString())

    const minPrice = value.price[0];
    const maxPrice = value.price[1];
    if (value.rooms == 0 || value.bathrooms == 0) {
      this.listPropertyByProvince = this.listPropertyByProvince.filter(property => {
        return property.price >= minPrice && property.price <= maxPrice

      });

    }
    this.listPropertyByProvince = this.listPropertyByProvince.filter(property => {
      return property.price >= minPrice && property.price <= maxPrice

    });
    this.totalRecords = this.listPropertyByProvince.length
    console.log(this.totalRecords)
  }

  onSubmitFilter() {
    console.log(this.form.value)
    var propertyStatus;
    if (this.form.get('status').value == "") {
      propertyStatus = "all";
    } else {
      propertyStatus = this.form.get('status').value;
    }
    const minPrice = this.form.get('price').value[0];
    const maxPrice = this.form.get('price').value[1];
    const minSize = this.form.get('size').value[0];
    const maxSize = this.form.get('size').value[1];
    const rooms = this.form.get('rooms').value;
    const bathrrooms = this.form.get('bathrooms').value;
    const amenitiesArray = this.form.get('checkArray').value;

    if (amenitiesArray.length != 0) {
      var query1 : string = " (property.price >= minPrice) &&\n" +
        "  (property.price <= maxPrice) && (property.size >= minSize) &&\n" +
        "   (property.size <= maxSize) && (property.rooms == rooms) && (property.bathrooms == bathrrooms) ";

      var query2 : string = " (property.price >= minPrice) &&\n" +
        "  (property.price <= maxPrice) && (property.size >= minSize) &&\n" +
        "   (property.size <= maxSize) && (property.rooms == rooms) && (property.bathrooms == bathrrooms) && (property.status == propertyStatus)";
      amenitiesArray.forEach(p => {

        query1 = query1.concat(" && (property."+p+" = true)");
        console.log(query1)

      })
        if (propertyStatus == "all") {
          this.listPropertyFiltered = this.listPropertyByProvince.filter(property => {
            let result = ts.transpile(query1);
            console.log(query1)
            return (eval(query1));
          })
          console.log(this.listPropertyFiltered)
          this.totalRecords = this.listPropertyFiltered.length;

        }
        else {
          this.listPropertyFiltered = this.listPropertyByProvince.filter(property => {
            let result = ts.transpile(query2);
            return (result)
          })

          this.totalRecords = this.listPropertyFiltered.length;

        }

    }
    else {
      if (propertyStatus == "all"){
        this.listPropertyFiltered = this.listPropertyByProvince.filter(property => {
          return  property.price >= minPrice &&
            property.price <= maxPrice && property.size >= minSize &&
            property.size <= maxSize && property.rooms == rooms && property.bathrooms == bathrrooms
        })

        this.totalRecords = this.listPropertyFiltered.length;
        console.log('listfiltered')
        console.log(this.listPropertyFiltered)
        console.log('listByprovince *********')

        console.log(this.listPropertyByProvince)
      }
     else {
        this.listPropertyFiltered = this.listPropertyByProvince.filter(property => {
          return property.status == propertyStatus && property.price >= minPrice &&
            property.price <= maxPrice && property.size >= minSize &&
            property.size <= maxSize && property.rooms == rooms && property.bathrooms == bathrrooms
        })

        this.totalRecords = this.listPropertyFiltered.length;
        console.log('listfiltered')
        console.log(this.listPropertyFiltered)
        console.log('listByprovince *********')

        console.log(this.listPropertyByProvince)
      }


    }
  }


  onCheckboxChange(e) {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
}
