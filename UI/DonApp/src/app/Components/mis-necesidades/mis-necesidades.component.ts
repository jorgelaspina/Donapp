import { Component, OnInit } from '@angular/core';
import {ServicioSharedService} from 'src/app/services/servicio-shared.service';
import { NecesidadesService } from 'src/app/services/necesidades.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-necesidades',
  templateUrl: './mis-necesidades.component.html',
  styleUrls: ['./mis-necesidades.component.css']
})
export class MisNecesidadesComponent implements OnInit {

  constructor(
    private servicio:ServicioSharedService,
    private servicioNecesidades:NecesidadesService,
    private servicioUsuario:UsuarioService,
    private dialogService:DialogService,
    private router: Router
    ) { } 

  misNecesidades:any=[];
  latitud:any;
  longitud:any;

  ngOnInit(): void {
      this.servicio.getPosition().then(pos => {
      this.latitud = pos.lat;
      this.longitud = pos.lng;
      this.refreshMisNecesidades();})
  }

  refreshMisNecesidades(){
    const user = {
      ID:this.servicioUsuario.getUserId(),
      nombreUsuario:"",
      contrasenia:""
    }
      this.servicioNecesidades.getMisNecesidades(user).subscribe(data=>{
      this.misNecesidades=data;
    });
  }
  abrirConversacion(Id:any)
  {
    this.router.navigateByUrl("/conversaciones/"+Id);    
  }
  eliminarNecesidad(nec:any){
    const estado = {
      ID:nec.ID,
      estado:'No Disponible'
    }
    let dialogRef = this.dialogService.openConfirmDialog(
      {titulo:'Eliminar', mensaje: '¿Quieres eliminar esta necesidad?', botonCancel:'No', botonConfirm: 'Si'}
      );
      dialogRef.subscribe(res => {
        if(res){
          this.servicioNecesidades.estadoNecesidad(estado).subscribe(data=>{
            console.log(data);
            this.refreshMisNecesidades();
          });
        }
      });
    }
    valorarDonacion(don:any)
    {
      console.log("Necesidad ID :"+don.ID)
      this.router.navigateByUrl("/valorardonacion/"+don.ID); 
    }
}