import { Component, OnInit } from '@angular/core';
import {ServicioSharedService} from 'src/app/services/servicio-shared.service';
import { DonacionesService } from 'src/app/services/donaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-donaciones',
  templateUrl: './mis-donaciones.component.html',
  styleUrls: ['./mis-donaciones.component.css']
})
export class MisDonacionesComponent implements OnInit {

  constructor(
    private servicio:ServicioSharedService,
    private servicioDonaciones:DonacionesService,
    private servicioUsuario:UsuarioService,
    private dialogService:DialogService,
    private router: Router) { } 

  misDonaciones:any=[];
  latitud:any;
  longitud:any;

  ngOnInit(): void {
      this.servicio.getPosition().then(pos => {
      this.latitud = pos.lat;
      this.longitud = pos.lng;
      this.refreshMisDonaciones();})
  }

  refreshMisDonaciones(){
    const user = {
      ID:this.servicioUsuario.getUserId(),
      nombreUsuario:"",
      contrasenia:""
    }
      this.servicioDonaciones.getMisDonaciones(user).subscribe(data=>{
      this.misDonaciones=data;
    });
  }
  eliminarDonacion(don:any){
    const estado = {
      ID:don.ID,
      estado:'No Disponible'
    }
    let dialogRef = this.dialogService.openConfirmDialog(
      {titulo:'Eliminar', mensaje: '¿Quieres eliminar esta donación?', botonCancel:'No', botonConfirm: 'Si'}
      );
      dialogRef.subscribe(res => {
        if(res){
          this.servicioDonaciones.estadoDonacion(estado).subscribe(data=>{
            console.log(data);
            this.refreshMisDonaciones();
          });
        }
      });
    }
    abrirConversacion(Id:any)
    {
      this.router.navigateByUrl("/conversaciones/"+Id);    
    }
  }