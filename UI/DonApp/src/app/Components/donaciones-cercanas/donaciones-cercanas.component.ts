import { Component, OnInit } from '@angular/core';
import {ServicioSharedService} from 'src/app/services/servicio-shared.service';
import { DialogService } from 'src/app/services/dialog.service';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { UsuarioService } from '../../services/usuario.service';
import { DonacionesService } from 'src/app/services/donaciones.service';
import { ActivatedRoute } from '@angular/router';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { DeclarationListEmitMode } from '@angular/compiler';



@Component({
  selector: 'app-donaciones-cercanas',
  templateUrl: './donaciones-cercanas.component.html',
  styleUrls: ['./donaciones-cercanas.component.css']
})
export class DonacionesCercanasComponent implements OnInit {


  constructor(    
    private dialogService: DialogService,
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService,
    private servicio: ServicioSharedService,
    private donacionesService: DonacionesService,
    private NotificacionesService: NotificacionService,
    private route: ActivatedRoute) { }

  donacionesCercanas:any=[];
  donacionesCercanasFiltradas:any=[];
  latitud:any;
  longitud:any;
  titulo:any;
  tituloBuscado:string='';
  fotoPath:string='http://localhost:55481/fotosDonacion/';
;

  ngOnInit(): void {
      this.servicio.getPosition().then(pos => {
      this.latitud = pos.lat;
      this.longitud = pos.lng;
      this.titulo = this.route.snapshot.params['titulo'];
      console.log("ngOnInit  titulo ---> " + this.titulo);
      this.refreshDonaciones();
    })
  } 

  refreshDonaciones()
  {
    if(this.titulo==undefined)
    {
      const val = {
        latitud:this.latitud,
        longitud:this.longitud,
        usuarioID:this.usuarioService.getUserId()};
      this.donacionesService.getDonacionesCercanas(val).subscribe(data=>{
        this.donacionesCercanas=data;
        this.donacionesCercanasFiltradas=this.donacionesCercanas;        
      });
    }
    else
    {
      const val = {
        latitud:this.latitud,
        longitud:this.longitud,
        usuarioID:this.usuarioService.getUserId(),
        titulo:this.titulo};
      this.donacionesService.getDonacionesRelacionadas(val).subscribe(data=>{
        this.donacionesCercanas=data;
        this.donacionesCercanasFiltradas=this.donacionesCercanas;
      });
    }
  }
  
  solicitarDonacion(dataItem:any){
    const solicitud = {
      tipoSolicitud:"solicitudDonacion"
      ,ID_UsuarioEmisor:this.usuarioService.getUserId()
      ,ID_Necesidad: 0
      ,ID_Donacion: dataItem.ID
    }
    let dialogRef = this.dialogService.openConfirmDialog(
    {titulo:'Confirmación', mensaje: '¿Quieres solicitar esta donación?', botonCancel:'No', botonConfirm: 'Si'}
    );
    dialogRef.subscribe(res => {
      if(res){
        this.solicitudService.generarNuevaSolicitud(solicitud).subscribe(res2=>{
          let dialogRef = this.dialogService.openAcceptDialog(
            {titulo:'Confirmación', mensaje: res2.toString(), botonConfirm: 'Aceptar', botonCancel: 'NA'}
            );
            this.generarNotificacion(dataItem.ID, dataItem.ID_Usuario);
            this.refreshDonaciones();
        });             
      };
    });    
  }
  filtrarPorTitulo(event:any)
  {
    console.log("event logged: "+event.target.value)
    const tituloBuscado = event.target.value
    if(tituloBuscado == "")
      this.donacionesCercanasFiltradas = this.donacionesCercanas
    else
      this.donacionesCercanasFiltradas = this.donacionesCercanas.filter(
        (donacion:any) => donacion["titulo"].toUpperCase().includes(tituloBuscado.toUpperCase())
      )    
  }
  mostrarFotoArticulo(dataItem:any){    
    var foto = this.fotoPath+dataItem.fotoFullName;
    console.log("FotoPath: "+ foto)
    let dialogRef = this.dialogService.openFotoDialog(
        {fotoPath: foto,
          titulo:dataItem.titulo,
          estrellas:dataItem.estrellasSegunDonante,
          descripcion:dataItem.descripcion
        }
        );
      }
      generarNotificacion(itemId:Number, ItemUsuario:Number)
      {
        const notificacion = {
          titulo:"Solicitud de Donación",
          mensaje:"te solicita",
          leido:0,
          ID_Usuario:ItemUsuario,
          ID_Emisor:this.usuarioService.getUserId(),
          ID_Solicitud: -1,
          ID_Donacion: itemId,
          ID_Necesidad: -1
  
        }
        this.NotificacionesService.nuevaNotificaciones(notificacion).subscribe(res => {
          console.log(notificacion);
        });
      }
}