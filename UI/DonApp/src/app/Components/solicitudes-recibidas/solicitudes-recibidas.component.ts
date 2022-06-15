import { Component, OnInit } from '@angular/core';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ConversacionService } from 'src/app/services/conversacion.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DonacionesService } from 'src/app/services/donaciones.service';
import { NecesidadesService } from 'src/app/services/necesidades.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-solicitudes-recibidas',
  templateUrl: './solicitudes-recibidas.component.html',
  styleUrls: ['./solicitudes-recibidas.component.css']
})
export class SolicitudesRecibidasComponent implements OnInit {

  solicitudesrecibidas:any=[];
  historialUsuario:any=[];

  constructor(
    private solicitudService: SolicitudService,
    private servicioUsuario:UsuarioService,
    private servicioConversacion:ConversacionService,
    private dialogService:DialogService,
    private servicioDonacion:DonacionesService,
    private servicioNecesidad:NecesidadesService,
    private usuarioService: UsuarioService,
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
      this.solicitudesrecibidas=data.filter((solicitud:any) => solicitud["tipoSolicitud"] === 'solicitudDonacion');
    });
    console.log(this.solicitudesrecibidas)
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
    console.log(dataItem)
    this.solicitudService.estadoSolicitud(SolEst).subscribe(data=>{
      this.servicioDonacion.estadoDonacion(DonEst).subscribe(rslt=>{
        console.log("Estado de Donacion: Confirmado", DonEst);
      });
        this.generarNotificacion(dataItem.ID_Donacion, "aceptó", dataItem.ID_UsuarioEmisor)
      console.log("Estado de Solicitud: Aceptado", SolEst);
      this.crearConversacion(dataItem.ID);
      console.log(dataItem.ID);
    })}

  rechazarSolicitud(dataItem:any){
    const SolEst = {
    ID:dataItem.ID,
    estado:"Rechazado"
  }
  const DonEst = {
    ID:dataItem.ID_Donacion,
    estado:"Disponible"
  }
  console.log(dataItem)
  this.solicitudService.estadoSolicitud(SolEst).subscribe(data=>{
    this.servicioDonacion.estadoDonacion(DonEst).subscribe(rslt=>{
      console.log("Estado de Donacion: Disponible", DonEst);
    });
    this.generarNotificacion(dataItem.ID_Donacion, "rechazó", dataItem.ID_UsuarioEmisor)
    console.log("Estado de Solicitud: Rechazado", SolEst);
    this.refreshSolicitudesRecibidas();
  })}

  crearConversacion(Sol:any){
    console.log("Creando conversacion para Solicitud" + Sol)
    const conv = { ID_Solicitud:Sol}
    this.servicioConversacion.abrirConversacion(conv).subscribe(res2=>{
      let dialogRef = this.dialogService.openAcceptDialog(
        {titulo:res2, mensaje: "Ahora puedes contactarte con el solicitante", botonConfirm: 'Entendido', botonCancel: 'NA'}
        );
        this.router.navigateByUrl("/conversaciones/"+Sol); 
    });    
  }
  mostrarHistorialUsuario(id:any, nombre:string, apellido:string, puntaje:number){
    this.usuarioService.getHistorialUsuario(id).subscribe(data=>{
      this.historialUsuario=data;
      let dialogRef = this.dialogService.openHistorialDialog(
        {titulo: "Historial del usuario",
        subtitulo: nombre +" "+apellido,
        mensaje: "En esta ventana se muestran las ultimas necesidades y donaciones del usuario solicitante. ID: "+ id,
        puntajeDonador: puntaje,
        botonConfirm: 'Cerrar',
        botonCancel: 'NA', 
        registros: this.historialUsuario}
        );
      })
    }
    generarNotificacion(Itemid:number, caso:String, itemUsuario:number)
      {
        const notificacion = {
          titulo:"Aceptacion de Solicitud",
          mensaje: caso + " tu solicitud de ",
          leido:0,
          ID_Usuario:itemUsuario,
          ID_Emisor:this.usuarioService.getUserId(),
          ID_Solicitud: -1,
          ID_Donacion: Itemid,
          ID_Necesidad: -1
  
        }
        this.notificacionService.nuevaNotificaciones(notificacion).subscribe(res => {
          console.log(notificacion);
        });
      }
      
}
