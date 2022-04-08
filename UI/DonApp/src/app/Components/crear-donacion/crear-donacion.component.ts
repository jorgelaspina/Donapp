import { Component, OnInit } from '@angular/core';
import { ServicioSharedService } from '../../services/servicio-shared.service';
import { PosicionService } from '../../services/posicion.service';
import { UsuarioService } from '../../services/usuario.service';
import { DialogService } from 'src/app/services/dialog.service';
import { NecesidadesService } from 'src/app/services/necesidades.service';
import { DonacionesService } from 'src/app/services/donaciones.service';
import { Router } from '@angular/router';
import {formatDate} from '@angular/common';




@Component({
  selector: 'app-crear-donacion',
  templateUrl: './crear-donacion.component.html',
  styleUrls: ['./crear-donacion.component.css']
})
export class CrearDonacionComponent implements OnInit {

  constructor(
    private servicio:ServicioSharedService,
    private servicioNecesidades:NecesidadesService,
    private servicioDonaciones:DonacionesService,
    private servicioPosicion:PosicionService,
    private usuarioService: UsuarioService,
    private dialogService: DialogService,
    private router: Router

    ) { }

  titulo:string='';
  descripcion:string='';
  categorias:any=[];
  latitud:any;
  longitud:any;
  direccion:any=[];
  estrellas:any;
  catSelected:any;
  address:any;
  fotoPath:string='http://localhost:55481/fotosDonacion/';
  fotoName:string='';
  fotoFullName:string='';

  crearDonacion(){
    const val = {
      titulo:this.titulo,
      descripcion:this.descripcion,
      latitud:this.latitud,
      longitud:this.longitud,
      direccion:this.address,
      estrellasSegunDonante:this.estrellas,
      ID_Usuario:this.usuarioService.getUserId(),
      ID_Estado: 2, // Estado Disponible
      ID_Categoria:this.catSelected,
      fotoFullName:this.fotoName
    };
    this.servicioNecesidades.getNecesidadesRelacionadas(val).subscribe(res=>{
      if(res.length > 0)
      {
        let dialogRef = this.dialogService.openConfirmDialog(
          {titulo:"Info", mensaje: "Se han encontrado necesidades que podrian estar relacionadas a su donación. ¿Quieres verlas?", botonConfirm: 'Si', botonCancel: 'No'}
          );
        dialogRef.subscribe(res => {
            if(res){
              console.log('Ir a Necesidades Cercanas filtradas por este titulo:'+ val.titulo);
              this.router.navigateByUrl("/necesidadescercanas/"+val.titulo);
              return;
            }
            else{
              this.servicio.addDonacion(val).subscribe(res=>{
                console.log(val)
                let dialogRef = this.dialogService.openAcceptDialog(
                  {titulo:"Info", mensaje: "Donación registrada con éxito", botonConfirm: 'Aceptar', botonCancel: 'NA'}
                  );
                this.router.navigateByUrl("/misdonaciones");
                return;
              })              
            }
          })
        }
        else{
          this.servicio.addDonacion(val).subscribe(res=>{
            console.log(val)
            let dialogRef = this.dialogService.openAcceptDialog(
              {titulo:"Info", mensaje: "Donación registrada con éxito", botonConfirm: 'Aceptar', botonCancel: 'NA'}
              );
              this.router.navigateByUrl("/misdonaciones");
          })    
        }
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
  }

  refreshCategorias(){
    this.servicio.getCategoria().subscribe(data=>{
      this.categorias=data;
    });
    this.fotoName = this.usuarioService.getUserId()+'-'+formatDate(new Date(), 'yyyyMMddhhmmss', 'en')+'.jpeg'      
  }
  getLocation() {
    return this.servicio.getPosition().then(pos => {
        this.latitud = pos.lat;
        this.longitud = pos.lng;
    })
}
  getDomicilio() {
    return this.servicioPosicion.getDomicilio(this.latitud, this.longitud).then((dom: any) => {
      this.direccion = dom;
      this.address = this.direccion["items"]["0"]["address"]["label"]
    })
  }
  buscarNecesidadesRelacionadas()
  {

  }
  subirFotoArticulo(event:any)  
  {
    this.fotoFullName='';
    var foto=event.target.files[0];
    const formData:FormData=new FormData();
    formData.append('uploadedFile', foto, this.fotoName)
    this.servicioDonaciones.subirFoto(formData).subscribe((data:any)=>{
    this.fotoFullName = this.fotoPath+this.fotoName;
    })
  }
}
