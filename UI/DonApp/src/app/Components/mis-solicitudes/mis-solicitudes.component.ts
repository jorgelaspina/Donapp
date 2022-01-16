import { Component, OnInit } from '@angular/core';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ConversacionService } from 'src/app/services/conversacion.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DonacionesService } from 'src/app/services/donaciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-solicitudes',
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.css']
})
export class MisSolicitudesComponent implements OnInit {

  misSolicitudes:any=[];
  misSolicitudesFiltradas:any=[];
  filtroEstado=['Aceptado', 'Pendiente','Todos', 'Concretado'];
  seleccionadoEstado: string = 'Pendiente';


  constructor(
    private solicitudService: SolicitudService,
    private servicioUsuario:UsuarioService,
    private servicioConversacion:ConversacionService,
    private dialogService:DialogService,
    private servicioDonacion:DonacionesService,
    private router: Router
    ) { }

  refreshMisSolicitudes(){
    const user = {
      ID:this.servicioUsuario.getUserId(),
      nombreUsuario:"",
      contrasenia:""
    }
    this.solicitudService.getMisSolicitudes(user).subscribe(data=>{
      this.misSolicitudes=data;
      this.misSolicitudesFiltradas = this.misSolicitudes.filter((solicitud:any) => solicitud["estado"] === 'Pendiente')
    });
  }
  ngOnInit(): void {
    this.refreshMisSolicitudes();
  }

  cancelarSolicitud(dataItem:any){}


  abrirConversacion(dataItem:any)
    {
      console.log(dataItem.ID)
      this.router.navigateByUrl("/conversaciones/"+dataItem.ID);    
    }

    valorarDonacion(dataItem:any)
    {
      console.log(dataItem.ID)
      this.router.navigateByUrl("/valorardonacion/"+dataItem.ID);
    }

    filtrar(event:any)
    {
      const estadoFiltrado = event.target.value
      if(estadoFiltrado == "Todos")
        this.misSolicitudesFiltradas = this.misSolicitudes
      else
        this.misSolicitudesFiltradas = this.misSolicitudes.filter((solicitud:any) => solicitud["estado"] === estadoFiltrado)
    }
      
}
