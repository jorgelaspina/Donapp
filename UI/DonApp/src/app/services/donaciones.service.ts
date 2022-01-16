import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonacionesService {

  readonly APIUrl ="http://localhost:55481/api"
  
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

  getDonacionFromSolicitud(val:any){
    return this.http.get<any>(this.APIUrl+'/donacion/porsolicitud/'+val)
    }
  
  getIDUltimaDonacionCargada(){
    return this.http.get<any>(this.APIUrl+'/donacion/ultimaDonacionID')
  }
  getDonacionesRelacionadas(val:any){
    return this.http.post<any>(this.APIUrl+'/donacion/donacionesRelacionadas',val)
  }  
  
}