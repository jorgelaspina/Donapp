import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PosicionService {

  domicilio:any;
  var:any;

  constructor(private http:HttpClient) {  
  }

  readonly GoogleUrl ="https://maps.googleapis.com/maps/api/geocode/json?latlng=";
  readonly APIKey = 'AIzaSyDTqbLNPrxz0zUf0KNoqa5AQ6cuJg7m3HY'

  getDomicilio(lat:string, long:string){
    this.var = this.GoogleUrl+lat+","+long+"&key="+this.APIKey;
    console.log(this.var);
    return fetch(this.var)
    .then(response => response.json())
    }
}
