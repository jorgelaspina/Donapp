import { Component, OnInit } from '@angular/core';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ConversacionService } from 'src/app/services/conversacion.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-valorar-donacion',
  templateUrl: './valorar-donacion.component.html',
  styleUrls: ['./valorar-donacion.component.css']
})
export class ValorarDonacionComponent implements OnInit {

  ID_Necesidad:any;
  Solicitud:any;
  

  constructor(
    private solicitudService: SolicitudService,
    private servicioUsuario:UsuarioService,
    private servicioConversacion:ConversacionService,
    private dialogService:DialogService,
    private route: ActivatedRoute,

    ) { }

  estrellas:number=0;
  
  ngOnInit(): void {
    this.ID_Necesidad = this.route.snapshot.paramMap.get('id');
    console.log("Parameter read"+ this.ID_Necesidad);
    this.obtenerSolicitud();
    console.log(this.Solicitud)

  }
  obtenerSolicitud(){
    const nec = {
      ID:this.ID_Necesidad,
      };
      this.solicitudService.postSolicitudDesdeNecesidad(nec).subscribe(data=>{
      this.Solicitud=data;
    });
  }
  

  donacionRecibida(){
    console.log("Donacion Recibida: ID " + this.ID_Necesidad)
    console.log("Donacion Recibida: ID " + this.Solicitud.ID)
  }
  donacionNoRecibida(){
    console.log("Donacion No Recibida")
  }
}
