import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversacionService {

  readonly APIUrl ="http://192.168.0.95:55481/api"
  
  constructor(private http:HttpClient) {  
   }

  abrirConversacion(val:any){
    return this.http.post<any>(this.APIUrl+'/conversacion',val)
  }
}