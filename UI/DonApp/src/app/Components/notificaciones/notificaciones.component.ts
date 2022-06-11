import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {

  misNotificaciones:any=[];
  constructor(   
    private notificacionService:NotificacionService,
    private servicioUsuario:UsuarioService,
    private router: Router
    ) { }

  refreshMisSolicitudes(){
    const user = {
      ID:this.servicioUsuario.getUserId(),
      nombreUsuario:"",
      contrasenia:""
    }
    this.notificacionService.getNotificaciones(user.ID).subscribe(data=>{
      this.misNotificaciones=data;
    });
  }
  ngOnInit(): void {
    this.refreshMisSolicitudes();
  }
}
