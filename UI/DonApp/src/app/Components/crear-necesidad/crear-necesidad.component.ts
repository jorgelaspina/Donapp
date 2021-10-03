import { Component, OnInit } from '@angular/core';
import { NecesidadesService } from '../../services/necesidades.service';
import { PosicionService } from '../../services/posicion.service';
import { ServicioSharedService} from '../../services/servicio-shared.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-crear-necesidad',
  templateUrl: './crear-necesidad.component.html',
  styleUrls: ['./crear-necesidad.component.css']
})
export class CrearnecesidadComponent implements OnInit {

  constructor(
    private Necesidadeservice:NecesidadesService,
    private servicioPosicion:PosicionService,
    private servicio:ServicioSharedService,
    private usuarioService: UsuarioService
    ) {}


  titulo:string='';
  descripcion:string='';
  categorias:any=[];
  latitud:any;
  longitud:any;
  direccion:any=[];
  catSelected:number=1;

  crearNecesidad(){
    const val = {
      titulo:this.titulo,
      descripcion:this.descripcion,
      latitud:this.latitud,
      longitud:this.longitud,
      direccion:this.direccion.results[0].formatted_address,
      ID_Usuario:this.usuarioService.getUserId(),
      ID_Categoria:this.catSelected
    };
    console.log('val', val)
    this.Necesidadeservice.addNecesidad(val).subscribe(res=>{
      alert(res.toString());
    })
    this.limpiarForm();
  }

  limpiarForm(){
    this.titulo='';
    this.descripcion='';
    this.catSelected=1;
  }
  async ngOnInit(): Promise<void> {
      this.refreshCategorias();
      await this.getLocation();      
      await this.getDomicilio();
console.log(this.direccion.results[0].formatted_address);        
  }
  refreshCategorias(){
    this.servicio.getCategoria().subscribe(data=>{
      this.categorias=data;
    });
  }
  getLocation() {
    return this.servicio.getPosition().then(pos => {
        this.latitud = pos.lat;
        this.longitud = pos.lng;
        console.log("1"+pos.lat+"-"+pos.lng)
    })
}
  getDomicilio() {
    return this.servicioPosicion.getDomicilio(this.latitud, this.longitud).then((dom: any) => {
      this.direccion = dom;
    })
  }
}
