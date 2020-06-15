import {Property} from "./property";

export class User {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  role : string;
  favourites : Property[];
}
