import { Component, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { DialogService } from 'src/app/services/dialog.service';
import { ServicioSharedService } from 'src/app/services/servicio-shared.service';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { UsuarioService } from '../../services/usuario.service';



@Component({
  selector: 'app-necesidades-cercanas',
  templateUrl: './necesidades-cercanas.component.html',
  styleUrls: ['./necesidades-cercanas.component.css']
})
export class NecesidadesCercanasComponent implements OnInit {

  constructor(
    private servicio:ServicioSharedService,
    private dialogService: DialogService,
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService) { }

  necesidadesCercanas:any=[];
  latitud:any;
  longitud:any;
  confirmaSol:any;

  ngOnInit(): void {
      this.servicio.getPosition().then(pos => {
      this.latitud = pos.lat;
      this.longitud = pos.lng;
      this.refreshNecesidadesCercanas();
     })
  }

  refreshNecesidadesCercanas(){
    const val = {
      latitud:this.latitud,
      longitud:this.longitud,
      usuarioID:this.usuarioService.getUserId()};
      console.log('val', val)
    this.servicio.getNecesidadesCercanas(val).subscribe(data=>{
      this.necesidadesCercanas=data;
    });
  }
  ofrecerDonacion(dataItem:any){
    const solicitud = {
      tipoSolicitud:"ofrecimientoDonacion"
      ,ID_UsuarioEmisor:this.usuarioService.getUserId()
      ,ID_Necesidad: dataItem.ID
      ,ID_Donacion: 0
    }
    let dialogRef = this.dialogService.openConfirmDialog(
    {titulo:'Confirmación', mensaje: '¿Quieres ofrecer una donación a ésta necesidad?', botonCancel:'No', botonConfirm: 'Si'}
    );
    dialogRef.subscribe(res => {
      if(res){
        this.solicitudService.generarNuevaSolicitud(solicitud).subscribe(res2=>{
          alert(res2.toString())});             
      };
    });    
  }
}

