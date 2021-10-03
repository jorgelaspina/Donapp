import { Component, OnInit } from '@angular/core';
import { MensajeService } from 'src/app/services/mensaje.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-conversaciones',
  templateUrl: './conversaciones.component.html',
  styleUrls: ['./conversaciones.component.css']
})
export class ConversacionesComponent implements OnInit {

  constructor(
    private MensajeService:MensajeService,
    private route: ActivatedRoute
  ) { }

  ID_Conv:any;
  Mensajes:any=[];
  mensajeNuevo:string='';


  getMensajesConversacion(){
    this.MensajeService.getMensajesDeConversacion(this.ID_Conv).subscribe(data => {
      this.Mensajes = data;
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
    this.ID_Conv = this.route.snapshot.paramMap.get('id');
    console.log(this.ID_Conv);
    this.getMensajesConversacion();
  }
}
