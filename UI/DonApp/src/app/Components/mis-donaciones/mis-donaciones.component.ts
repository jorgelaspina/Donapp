import { Component, OnInit } from '@angular/core';
import {ServicioSharedService} from 'src/app/services/servicio-shared.service';
import { DonacionesService } from 'src/app/services/donaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { SolicitudService } from 'src/app/services/solicitud.service';


@Component({
  selector: 'app-mis-donaciones',
  templateUrl: './mis-donaciones.component.html',
  styleUrls: ['./mis-donaciones.component.css']
})
export class MisDonacionesComponent implements OnInit {

  constructor(
    private servicio:ServicioSharedService,
    private servicioDonaciones:DonacionesService,
    private servicioSolicitudes: SolicitudService,
    private servicioUsuario:UsuarioService,
    private dialogService:DialogService,
    private router: Router) { } 

  misDonaciones:any=[];
  misDonacionesFiltradas:any=[];
  ID_Sol:any=[];
  latitud:any;
  longitud:any;
  filtroEstado=['Todos', 'Confirmado','Concretado','Pendiente', 'Ofrecido'];
  seleccionadoEstado: string = 'Todos';

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
      this.misDonacionesFiltradas=this.misDonaciones
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

    eliminarDonacionOfrecida(don:any){
      const estado = {
        ID:don.ID,
        estado:'No Disponible'
      }
      let dialogRef = this.dialogService.openConfirmDialog(
        {titulo:'Eliminar', mensaje: '¿Quieres eliminar esta donación? Se eliminará también el ofrecimiento asociado.', botonCancel:'No', botonConfirm: 'Si'}
        );
        dialogRef.subscribe(res => {
          if(res){
            this.servicioDonaciones.estadoDonacion(estado).subscribe(data=>{
              this.servicioSolicitudes.getSolicitudDesdeDonacion(don.ID).subscribe(data => {
                this.ID_Sol = data;
                const solEstado = {
                  ID: this.ID_Sol[0]["ID"],
                  estado:'No Disponible'
                }
                console.log(solEstado)
                this.servicioSolicitudes.estadoSolicitud(solEstado).subscribe(data=>{
                  console.log(data);
                });
              })
              this.refreshMisDonaciones();
            });
          }
        });
      }

    abrirConversacion(Id:any)
    {
      console.log("Don =" + Id)
      this.servicioSolicitudes.getSolicitudDesdeDonacion(Id).subscribe(data => {
        this.ID_Sol = data;        
        console.log(this.ID_Sol[0]["ID"])
        this.router.navigateByUrl("/conversaciones/"+ this.ID_Sol[0]["ID"]); 
      });
    }
    filtrar(event:any)
    {
      const estadoFiltrado = event.target.value
      if(estadoFiltrado == "Todos")
        this.misDonacionesFiltradas = this.misDonaciones
      else
        this.misDonacionesFiltradas = this.misDonaciones.filter((donacion:any) => donacion["estado"] === estadoFiltrado)
      
    }
  }