import { Component, OnInit } from '@angular/core';
import {UsuarioService} from 'src/app/services/usuario.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private servicioUsuario:UsuarioService,
    public router: Router) { }

  usuario:any;
  contrasenia:any;
  usuariodata:any=[];

  ngOnInit(): void {
  }

  ingresar(){
    const val = {
      nombreUsuario:this.usuario,
      contrasenia:this.contrasenia};
    this.servicioUsuario.LoginUsuario(val).subscribe(data=>{
      this.usuariodata=data;
    if (this.usuariodata.length == 0 ){
        console.log('Usuario o contraseña incorrecto. Ingrese nuevamente')
    }
    else{
      console.log("Usuario id: "+this.usuariodata[0].ID);
      this.servicioUsuario.setUserId(this.usuariodata[0].ID)
      this.router.navigate(["/principal"]);      
    }
  });
  }
}
