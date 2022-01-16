import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioSharedService {

  readonly APIUrl ="http://localhost:55481/api"
  private userId:number | undefined;

  constructor(private http:HttpClient) {}

  getDonacionesCercanas():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/donacion')
  }
  getNecesidadesCercanas(val:any):Observable<any[]>{
    return this.http.post<any>(this.APIUrl+'/necesidad/necesidadescercanas',val)
  }
  addDonacion(val:any){
    return this.http.post<any>(this.APIUrl+'/donacion',val)
  }
  getCategoria():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/categoria')
  }
  getPosition(): Promise<any> {
       return new Promise((resolve, reject) => {
           navigator.geolocation.getCurrentPosition(resp => {
                   resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
               },
               err => {
                   reject(err);
             });
       });
   }
   generarNuevaSolicitud(){
    const val = {
      tipoSolicitud:'sol.tipoSolicitud',
      ID_UsuarioEmisor:1,
      ID_Necesidad:1,
      ID_Donacion:1};
    return this.http.post(this.APIUrl+'/solicitud', val);  
  }
  getUserID(){
    return this.userId;
  }
}
