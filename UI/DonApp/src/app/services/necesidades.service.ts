import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NecesidadesService {

  readonly APIUrl ="http://192.168.0.95:55481/api"
  
  constructor(private http:HttpClient) {  
   }

  getNecesidadesCercanas(val:any){
    return this.http.post<any>(this.APIUrl+'/necesidad/necesidadescercanas',val)
  }
  
  addNecesidad(val:any){
    return this.http.post<any>(this.APIUrl+'/necesidad',val)
  }

  getMisNecesidades(val:any){
  return this.http.post<any>(this.APIUrl+'/necesidad/misnecesidades',val)
  }

  estadoNecesidad(val:any){
    return this.http.post<any>(this.APIUrl+'/necesidad/estado',val)
  }
  eliminarNecesidad(val:any){
    return this.http.delete<any>(this.APIUrl+'/necesidad/'+val)
  }
}