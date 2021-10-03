import { Component, OnInit } from '@angular/core';
import { SolicitudService } from 'src/app/services/solicitud.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  constructor( private solicitudService: SolicitudService) { }

  solicitudes:any=[];

  refreshSolicitudes(){
    this.solicitudService.getSolicitudes().subscribe(data=>{
      this.solicitudes=data;
    });
  }
  ngOnInit(): void {
    this.refreshSolicitudes();
  }

}
