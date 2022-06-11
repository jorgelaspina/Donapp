import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Solicitud } from '../models/solicitud';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  readonly APIUrl ="http://localhost:55481/api"


  constructor(private http:HttpClient) {}

  generarNuevaSolicitud(sol:any){
    const val =
    {
      tipoSolicitud:sol.tipoSolicitud,
      ID_UsuarioEmisor:sol.ID_UsuarioEmisor,
      ID_Necesidad:sol.ID_Necesidad,
      ID_Donacion:sol.ID_Donacion
    };
    return this.http.post(this.APIUrl+'/solicitud', val);  
  }


  getSolicitudes():Observable<any[]>{
  return this.http.get<any>(this.APIUrl+'/solicitud')
  }

  getSolicitudesRecibidas(val:any):Observable<any[]>{
    return this.http.post<any>(this.APIUrl+'/solicitud/solicitudesrecibidas',val)
    }

    getMisSolicitudes(val:any):Observable<any[]>{
    return this.http.post<any>(this.APIUrl+'/solicitud/missolicitudes',val)
    }


    estadoSolicitud(val:any){
      return this.http.post<any>(this.APIUrl+'/solicitud/estado',val)
    }
    postSolicitudDesdeNecesidad(val:any):Observable<any[]>{
      console.log("entrando al servicio");
      console.log(val);
      return this.http.post<any>(this.APIUrl+'/solicitud/solicitudDesdeNecesidad',val)
      }
    getSolicitudDesdeDonacion(val:any):Observable<any[]>{
      return this.http.get<any>(this.APIUrl+'/solicitud/porDonacion/'+val)
      }
    getSolicitud(val:any):Observable<any[]>{
      return this.http.get<any>(this.APIUrl+'/solicitud/'+val)
      }
}
