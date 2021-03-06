import { Component, OnInit } from '@angular/core';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ConversacionService } from 'src/app/services/conversacion.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DonacionesService } from 'src/app/services/donaciones.service';
import { NecesidadesService } from 'src/app/services/necesidades.service';
import { Router } from '@angular/router';
import { NotificacionService } from 'src/app/services/notificacion.service';


@Component({
  selector: 'app-ofrecimientos-recibidos',
  templateUrl: './ofrecimientos-recibidos.component.html',
  styleUrls: ['./ofrecimientos-recibidos.component.css']
})
export class OfrecimientosRecibidosComponent implements OnInit {

  ofrecimientos:any=[];

  constructor(
    private solicitudService: SolicitudService,
    private servicioUsuario:UsuarioService,
    private servicioConversacion:ConversacionService,
    private dialogService:DialogService,
    private servicioDonacion:DonacionesService,
    private servicioNecesidad:NecesidadesService,
    private notificacionService: NotificacionService,
    private router: Router
    ) { }

  refreshSolicitudesRecibidas(){
    const user = {
      ID:this.servicioUsuario.getUserId(),
      nombreUsuario:"",
      contrasenia:""
    }
    this.solicitudService.getSolicitudesRecibidas(user).subscribe(data=>{
      this.ofrecimientos = data.filter((solicitud:any) => solicitud["tipoSolicitud"] === 'ofrecimientoDonacion')
    });
  }

  ngOnInit(): void {
    this.refreshSolicitudesRecibidas();
  }

  aceptarSolicitud(dataItem:any){
    const SolEst = {
      ID:dataItem.ID,
      estado:"Aceptado"
    }
    const DonEst = {
      ID:dataItem.ID_Donacion,
      estado:"Confirmado"
    }
    const NecEst = {
      ID:dataItem.ID_Necesidad,
      estado:"Atendido"
    }    
    this.solicitudService.estadoSolicitud(SolEst).subscribe(data=>{
        this.servicioNecesidad.estadoNecesidad(NecEst).subscribe(rslt=>{
          this.servicioDonacion.estadoDonacion(DonEst).subscribe(rslt2=>{
            console.log("Estado de Donacion: Confirmado", DonEst);
          })          
          console.log("Estado de Necesidad: Atendido", NecEst);
        });
        this.generarNotificacion(dataItem.ID_Necesidad, "acept??", dataItem.ID_UsuarioEmisor )
        console.log("Estado de Solicitud: Aceptado", SolEst);
        this.crearConversacion(dataItem.ID);
        console.log(dataItem.ID);
        this.refreshSolicitudesRecibidas();
      })
  }

  rechazarSolicitud(dataItem:any){
    const SolEst = {
      ID:dataItem.ID,
      estado:"Rechazado"
    }
    const DonEst = {
      ID:dataItem.ID_Donacion,
      estado:"No Disponible"
    }
    const NecEst = {
      ID:dataItem.ID_Necesidad,
      estado:"Disponible"
    }    
    this.solicitudService.estadoSolicitud(SolEst).subscribe(data=>{
        this.servicioNecesidad.estadoNecesidad(NecEst).subscribe(rslt=>{
          this.servicioDonacion.estadoDonacion(DonEst).subscribe(rslt2=>{
            console.log("Estado de Donacion: No Disponible", DonEst);
          })          
          console.log("Estado de Necesidad: Disponible", NecEst);
        });
        this.generarNotificacion(dataItem.ID_Necesidad, "rechazo", dataItem.ID_UsuarioEmisor)
        console.log("Estado de Solicitud: Rechazado", SolEst);
        console.log(dataItem.ID);
        this.refreshSolicitudesRecibidas();
      })      
  }

  crearConversacion(Sol:any){
    console.log("Creando conversacion para Solicitud" + Sol)
    const conv = { ID_Solicitud:Sol}
    this.servicioConversacion.abrirConversacion(conv).subscribe(res2=>{
      let dialogRef = this.dialogService.openAcceptDialog(
        {titulo:res2, mensaje: "Ahora puedes contactarte con el donante", botonConfirm: 'Entendido', botonCancel: 'NA'}
        );
        this.router.navigateByUrl("/conversaciones/"+Sol.ID); 
    });
    
  }
  generarNotificacion(Itemid:number, caso:String, ItemUsuario:number)
      {
        const notificacion = {
          titulo:"Respuesta de Ofrecimiento",
          mensaje: caso + " tu ofrecimiento de ",
          leido:0,
          ID_Usuario:ItemUsuario,
          ID_Emisor:this.servicioUsuario.getUserId(),
          ID_Solicitud: -1,
          ID_Donacion: -1,
          ID_Necesidad: Itemid
  
        }
        this.notificacionService.nuevaNotificaciones(notificacion).subscribe(res => {
          console.log(notificacion);
        });
      }
}
