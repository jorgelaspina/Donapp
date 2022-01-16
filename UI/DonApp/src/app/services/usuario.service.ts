import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  readonly APIUrl ="http://localhost:55481/api"
  private userId:number;

  constructor(private http:HttpClient) {this.userId=1;}

  LoginUsuario(val:any):Observable<any[]>{
    return this.http.post<any>(this.APIUrl+'/usuario',val)  
  }  
  setUserId(id:number){
    console.log("Se setea el usuario de la clase ServiceUsuario a"+id)
    this.userId = id;
    console.log("userId: "+this.getUserId())
  }
  
  getUserId(){return this.userId;}  
}
