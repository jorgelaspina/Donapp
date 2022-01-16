import { Component, OnInit } from '@angular/core';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ConversacionService } from 'src/app/services/conversacion.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DonacionesService } from 'src/app/services/donaciones.service';
import { ValoracionService } from 'src/app/services/valoracion.service';
import { escapeRegExp } from '@angular/compiler/src/util';
import { NecesidadesService } from 'src/app/services/necesidades.service';
import { Subscriber } from 'rxjs';




@Component({
  selector: 'app-valorar-donacion',
  templateUrl: './valorar-donacion.component.html',
  styleUrls: ['./valorar-donacion.component.css']
})
export class ValorarDonacionComponent implements OnInit {

  ID_Solicitud:any;
  Solicitud:any;
  Donacion:any
  estrellas:number=0;


  constructor(
    private solicitudService: SolicitudService,
    private servicioDonacion: DonacionesService,
    private servicioNecesidad: NecesidadesService,
    private servicioValoracion: ValoracionService,
    private servicioUsuario:UsuarioService,
    private servicioConversacion:ConversacionService,
    private dialogService:DialogService,
    private route: ActivatedRoute,
    private router: Router

    ) { }


  
  ngOnInit(): void {
    this.ID_Solicitud = this.route.snapshot.paramMap.get('id');
    console.log("ID param"+this.ID_Solicitud)
    this.solicitudService.getSolicitud(this.ID_Solicitud).subscribe(data=>{
      this.Solicitud = data[0];
    })
    this.obtenerDonacion();
  }

  obtenerDonacion()
  {
    this.servicioDonacion.getDonacionFromSolicitud(this.ID_Solicitud).subscribe(data=>{
      this.Donacion = data[0];
  });}

  donacionRecibida(){
    const val = {
      estrellas:this.estrellas,
      ID_Solicitud:this.ID_Solicitud
    };
    console.log(val);
    this.servicioValoracion.addValoracion(val).subscribe(res=>{
      alert(res.toString());
    });
    this.concretarSolicitud();

    if(this.Solicitud.tipoSolicitud == 'solicitudDonacion')
        {this.router.navigateByUrl("/missolicitudes")}
    else
        {this.router.navigateByUrl("/misnecesidades")}
    
    }

  concretarSolicitud(){
      const SolEst = {
        ID:this.ID_Solicitud,
        estado:"Concretado"
      }
      const DonEst = {
        ID:this.Donacion.ID,
        estado:"Concretado"
      }
      console.log("Paso 1: Solicitud")
      console.log(this.Solicitud)

      const NecEst = {
        ID:this.Solicitud.ID_Necesidad,
        estado:"Resuelto"
      }
      
      this.solicitudService.estadoSolicitud(SolEst).subscribe(data=>{
        this.servicioDonacion.estadoDonacion(DonEst).subscribe(rslt=>{
          if(this.Solicitud.tipoSolicitud == 'ofrecimientoDonacion'){
            this.servicioNecesidad.estadoNecesidad(NecEst).subscribe(rslt2=>{
              console.log("Estado de Necesidad: Resuelto", NecEst);    
            })}
          console.log("Estado de Donacion: Confirmado", DonEst);
        });
        console.log("Estado de Solicitud: Aceptado", SolEst);
      })
    }
    

  donacionNoRecibida(){
    console.log("Donacion No Recibida")
  }
}
