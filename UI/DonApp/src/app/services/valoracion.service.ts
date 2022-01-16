import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValoracionService {

  readonly APIUrl ="http://localhost:55481/api"
  
  constructor(private http:HttpClient) {  
   }
  
  addValoracion(val:any){
    return this.http.post<any>(this.APIUrl+'/valoracion',val)
  }
}
