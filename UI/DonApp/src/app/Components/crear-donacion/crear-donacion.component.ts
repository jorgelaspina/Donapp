import { Component, OnInit } from '@angular/core';
import { ServicioSharedService } from '../../services/servicio-shared.service';
import { PosicionService } from '../../services/posicion.service';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-crear-donacion',
  templateUrl: './crear-donacion.component.html',
  styleUrls: ['./crear-donacion.component.css']
})
export class CrearDonacionComponent implements OnInit {

  constructor(
    private servicio:ServicioSharedService,
    private servicioPosicion:PosicionService,
    private usuarioService: UsuarioService
    ) { }

  titulo:string='';
  descripcion:string='';
  categorias:any=[];
  latitud:any;
  longitud:any;
  direccion:any=[];
  estrellas:any;
  catSelected:any;

  crearDonacion(){
    const val = {
      titulo:this.titulo,
      descripcion:this.descripcion,
      latitud:this.latitud,
      longitud:this.longitud,
      direccion:this.direccion.results[0].formatted_address,
      estrellasSegunDonante:this.estrellas,
      ID_Usuario:this.usuarioService.getUserId(),
      ID_Categoria:this.catSelected
    };
    console.log('val', val)
    this.servicio.addDonacion(val).subscribe(res=>{
      alert(res.toString());
    })
    this.limpiarForm();
  }

  limpiarForm(){
    this.titulo='';
    this.descripcion='';
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
