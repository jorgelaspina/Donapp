import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonacionesService {

  readonly APIUrl ="http://192.168.0.95:55481/api"
  
  constructor(private http:HttpClient) {  
   }

  getDonacionesCercanas(val:any){
    return this.http.post<any>(this.APIUrl+'/donacion/donacionescercanas',val)
  }  
  
  addDonacion(val:any){
    return this.http.post<any>(this.APIUrl+'/donacion',val)
  }

  estadoDonacion(val:any){
    return this.http.post<any>(this.APIUrl+'/donacion/estado',val)
  }

  getMisDonaciones(val:any){
  return this.http.post<any>(this.APIUrl+'/donacion/misdonaciones',val)
  }
}