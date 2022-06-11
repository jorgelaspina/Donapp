import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  readonly APIUrl ="http://localhost:55481/api"
  
  constructor(private http:HttpClient) {  
   }

  getNotificaciones(val:any){
    return this.http.get<any>(this.APIUrl+'/misnotificaciones/'+val)
  }

  nuevaNotificaciones(not:any){    
    return this.http.post(this.APIUrl+'/notificacion', not);   
  }
}