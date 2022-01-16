import { Component, OnInit } from '@angular/core';
import { MensajeService } from 'src/app/services/mensaje.service';
import { ActivatedRoute } from '@angular/router';
import { ConversacionService } from 'src/app/services/conversacion.service';


@Component({
  selector: 'app-conversaciones',
  templateUrl: './conversaciones.component.html',
  styleUrls: ['./conversaciones.component.css']
})
export class ConversacionesComponent implements OnInit {

  constructor(
    private MensajeService:MensajeService,
    private ConversacionService:ConversacionService,
    private route: ActivatedRoute
  ) { }

  ID_Sol:any;
  ID_Conv:any;
  Mensajes:any=[];
  mensajeNuevo:string='';


  getConversacionDeSolicitud(){
    this.ConversacionService.getConversacion(this.ID_Sol).subscribe(conv => {
      this.ID_Conv = conv[0].ID;
      console.log("get conversacion de solicitud = "+ this.ID_Sol)
      console.log(this.ID_Conv)
      this.getMensajesConversacion();
    });
  }

  getMensajesConversacion(){
    this.MensajeService.getMensajesDeConversacion(this.ID_Conv).subscribe(data => {
      this.Mensajes = data;
      console.log("Mensajes: ");
      console.log(data)
    });
  }

  enviarMensaje(){    
    const m = {
      ID_Conversacion:this.ID_Conv,
      mensaje:this.mensajeNuevo,
      leido:0,
      ID_UsuarioEmisor:1};
    console.log(m)
    this.MensajeService.nuevoMensaje(m).subscribe(res => {
      console.log(res);
      this.mensajeNuevo="";
      this.getMensajesConversacion();
    });

  }

  ngOnInit(): void {
    this.ID_Sol = this.route.snapshot.params['id'];;
    console.log("ngOnInit  ---> " + this.ID_Sol);
    this.getConversacionDeSolicitud();
  }
}
