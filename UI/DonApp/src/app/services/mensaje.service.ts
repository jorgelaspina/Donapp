import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  readonly APIUrl ="http://192.168.0.95:55481/api"
  
  constructor(private http:HttpClient) {  
   }

  getMensajesDeConversacion(val:any){
    return this.http.get<any>(this.APIUrl+'/mensaje/'+val)
  }

  nuevoMensaje(mensaje:any){    
    return this.http.post(this.APIUrl+'/mensaje', mensaje);  
  }
}