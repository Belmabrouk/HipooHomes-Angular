import {Province} from "../home/home.component";

export class Property {
   thumbnail : string;
   numPhotos: number;
   floor : string;
   price : number;
   propertyType : string;
   size : number;
   rooms : number;
   bathrooms : number
   address :string
   province : Province;
   municipality : string;
   district : string;
   neighborhood :string;
   latitude:string;
  longitude:string;
   showAddress:boolean;
   url: string;
   status:string;
   priceByArea:number;
   parking:boolean;
   haslift: boolean;


   AC : boolean;
   fittedWardrobe:boolean;
   garden:boolean;
  pool:boolean;
   garage:boolean;

   images: any;

}
