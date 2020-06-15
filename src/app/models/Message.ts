export class Message {
  message: string;
  fromId: string;
  toId: string;

  constructor(message: string, fromId: string , toId:string) {
    this.message=message;
    this.fromId=fromId;
    this.toId=toId;
  }
}
