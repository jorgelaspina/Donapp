import { Component, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { DialogService } from 'src/app/services/dialog.service';
import { ServicioSharedService } from 'src/app/services/servicio-shared.service';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { UsuarioService } from '../../services/usuario.service';
import { PosicionService } from '../../services/posicion.service';
import { DonacionesService } from '../../services/donaciones.service';
import { NecesidadesService } from '../../services/necesidades.service';
import { ActivatedRoute } from '@angular/router';



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
    private usuarioService: UsuarioService,
    private servicioPosicion:PosicionService,
    private DonacionesService: DonacionesService,
    private NecesidadesService: NecesidadesService,
    private route: ActivatedRoute

    ) { }

  necesidadesCercanas:any=[];
  latitud:any;
  longitud:any;
  confirmaSol:any;
  direccion:any;
  titulo:any;
  
  async ngOnInit(): Promise<void> {
    await this.getLocation();      
    await this.getDomicilio();  
      this.servicio.getPosition().then(pos => {
      this.latitud = pos.lat;
      this.longitud = pos.lng;
      this.titulo = this.route.snapshot.params['titulo'];
      console.log("ngOnInit  titulo ---> " + this.titulo);
      this.refreshNecesidades()
    })
  }

  refreshNecesidades()
  {
    if(this.titulo==undefined)
      {
        const val = {
          latitud:this.latitud,
          longitud:this.longitud,
          usuarioID:this.usuarioService.getUserId()};
        this.NecesidadesService.getNecesidadesCercanas(val).subscribe(data=>{
          this.necesidadesCercanas=data;
          console.log(data);
        });
      }
      else
      {
        const val = {
          latitud:this.latitud,
          longitud:this.longitud,
          usuarioID:this.usuarioService.getUserId(),
          titulo:this.titulo};
        this.NecesidadesService.getNecesidadesRelacionadas(val).subscribe(data=>{
          this.necesidadesCercanas=data;
          console.log(val)
          console.log(data);
        });
      }
  }

  ofrecerDonacion(dataItem:any){

    const donacionOfr = {
      titulo:dataItem.titulo,
      descripcion:"Ofrecimiento a Necesidad",
      latitud:this.latitud,
      longitud:this.longitud,
      direccion:"N/A",
      estrellasSegunDonante:0,
      ID_Usuario:this.usuarioService.getUserId(),
      ID_Categoria:0,
      ID_Estado:1 // Estado Ofrecido
    }
    
    let dialogRef = this.dialogService.openConfirmDialog(
    {titulo:'Confirmación', mensaje: '¿Quieres ofrecer una donación a ésta necesidad?', botonCancel:'No', botonConfirm: 'Si'}
    );
    dialogRef.subscribe(res => {
      if(res){
        this.servicio.addDonacion(donacionOfr).subscribe(res=>
          {
            this.DonacionesService.getIDUltimaDonacionCargada().subscribe(res2=> 
              { 
                const donacionId = res2[0].Id;
                const solicitud =
                {
                  tipoSolicitud:"ofrecimientoDonacion"
                  ,ID_UsuarioEmisor:this.usuarioService.getUserId()
                  ,ID_Necesidad: dataItem.ID
                  ,ID_Donacion: donacionId
                };
                this.solicitudService.generarNuevaSolicitud(solicitud).subscribe(res3=>{
                  let dialogRef = this.dialogService.openAcceptDialog(
                    {titulo:"Info", mensaje: "Se ha cargdo tu ofrecimiento de donación a esta Necesidad y se envió una solicitud al donatario.", botonConfirm: 'Aceptar', botonCancel: 'NA'}
                    );
                  this.refreshNecesidades();
                });
              })
          })
        }
      })                   
    }
  
  getDomicilio() {
    return this.servicioPosicion.getDomicilio(this.latitud, this.longitud).then((dom: any) => {
      this.direccion = dom;})}

  getLocation() {
        return this.servicio.getPosition().then(pos => {
            this.latitud = pos.lat;
            this.longitud = pos.lng;
        })
    }
  }

