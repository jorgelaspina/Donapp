import { Component, OnInit } from '@angular/core';
import {ServicioSharedService} from 'src/app/services/servicio-shared.service';
import { NecesidadesService } from 'src/app/services/necesidades.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { SolicitudService } from 'src/app/services/solicitud.service';

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
    private router: Router,
    private servicioSolicitud:SolicitudService
    ) { } 

  misNecesidades:any=[];
  misNecesidadesFiltradas:any=[]
  solicitud:any;
  latitud:any;
  longitud:any;
  filtroEstado=['Todos', 'Disponible', 'Atendido','Resuelto'];
  seleccionadoEstado: string = 'Todos';


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
      this.servicioNecesidades.getMisNecesidades(user.ID).subscribe(data=>{
      this.misNecesidades=data;
      this.misNecesidadesFiltradas = this.misNecesidades
    });
  }
  abrirConversacion(nec:any)
  {
    const necParam = {ID:nec.ID};
      this.servicioSolicitud.postSolicitudDesdeNecesidad(necParam).subscribe(data=>{       
        this.solicitud=data;
        this.router.navigateByUrl("/conversaciones/"+this.solicitud[0].ID);
        })
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
    obtenerSolicitud(Id:any){
      const nec = {ID:Id};
      this.servicioSolicitud.postSolicitudDesdeNecesidad(nec).subscribe(data=>{
      this.solicitud=data;
      console.log("step2")
      console.log(this.solicitud)
      });
    }

    filtrar(event:any)
    {
      const estadoFiltrado = event.target.value
      if(estadoFiltrado == "Todos")
        this.misNecesidadesFiltradas = this.misNecesidades
      else
        this.misNecesidadesFiltradas = this.misNecesidades.filter((necesidad:any) => necesidad["estado"] === estadoFiltrado)
      
    }

    valorarDonacion(nec:any)
    {
      const necParam = {ID:nec.ID};
      this.servicioSolicitud.postSolicitudDesdeNecesidad(necParam).subscribe(data=>{       
        this.solicitud=data;
        this.router.navigateByUrl("/valorardonacion/"+this.solicitud[0].ID);
        })
    }
}