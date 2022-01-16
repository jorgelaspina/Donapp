import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversacionService {

  readonly APIUrl ="http://localhost:55481/api"
  
  constructor(private http:HttpClient) {  
   }

  abrirConversacion(val:any){
    return this.http.post<any>(this.APIUrl+'/conversacion',val)
  }
  getConversacion(val:any){
    return this.http.get<any>(this.APIUrl+'/conversacion/solicitud/'+val)
  }
}