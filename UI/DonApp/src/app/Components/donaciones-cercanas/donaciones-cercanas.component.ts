import { Component, OnInit } from '@angular/core';
import {ServicioSharedService} from 'src/app/services/servicio-shared.service';
import { DialogService } from 'src/app/services/dialog.service';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { UsuarioService } from '../../services/usuario.service';
import { DonacionesService } from 'src/app/services/donaciones.service';



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
    private donacionesService: DonacionesService) { }

  donacionesCercanas:any=[];
  latitud:any;
  longitud:any;

  ngOnInit(): void {
      this.servicio.getPosition().then(pos => {
      this.latitud = pos.lat;
      this.longitud = pos.lng;
      this.refreshDonacionesCercanas();})
  }

  refreshDonacionesCercanas(){
    const val = {
      latitud:this.latitud,
      longitud:this.longitud,
      usuarioID:this.usuarioService.getUserId()};
      console.log('val', val)
    this.donacionesService.getDonacionesCercanas(val).subscribe(data=>{
      this.donacionesCercanas=data;
    });
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
        });             
      };
    });    
  }
   }