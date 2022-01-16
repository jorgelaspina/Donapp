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

  readonly GoogleUrl ="https://revgeocode.search.hereapi.com/v1/revgeocode?at=";
  readonly APIKey = '0Sad-6LIIRxps1p_yu78pdbZVYK868SFuWroMpREGAU'

  getDomicilio(lat:string, long:string){
    this.var = this.GoogleUrl+lat+"%2C"+long+"&lang=en-US&apikey="+this.APIKey;
    console.log(this.var);
    return fetch(this.var)
    .then(response => response.json())
    }
}
