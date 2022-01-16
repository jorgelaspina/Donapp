import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';
import { NecesidadesService } from '../../services/necesidades.service';
import { PosicionService } from '../../services/posicion.service';
import { ServicioSharedService} from '../../services/servicio-shared.service';
import { UsuarioService } from '../../services/usuario.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DonacionesService } from 'src/app/services/donaciones.service';

@Component({
  selector: 'app-crear-necesidad',
  templateUrl: './crear-necesidad.component.html',
  styleUrls: ['./crear-necesidad.component.css']
})
export class CrearnecesidadComponent implements OnInit {

  constructor(
    private Necesidadeservice:NecesidadesService,
    private donacionesService:DonacionesService,
    private servicioPosicion:PosicionService,
    private servicio:ServicioSharedService,
    private usuarioService: UsuarioService,
    private dialogService: DialogService,
    private dateService: DatePipe,
    private router: Router
    ) {}


  titulo:string='';
  descripcion:string='';
  categorias:any=[];
  latitud:any;
  longitud:any;
  direccion:any=[];
  catSelected:number=1;
  address:any;
  misNecesidades:any=[];

    async crearNecesidad(){
    const NoSuperaLimite = await this.NoSuperaLimite();
    
    console.log("Limite" + NoSuperaLimite)
    if(NoSuperaLimite)
    {
    const val = {
      titulo:this.titulo,
      descripcion:this.descripcion,
      latitud:this.latitud,
      longitud:this.longitud,
      direccion:this.address,
      ID_Usuario:this.usuarioService.getUserId(),
      ID_Categoria:this.catSelected
    };
    this.donacionesService.getDonacionesRelacionadas(val).subscribe(res=>{
      if(res.length > 0)
      {
        let dialogRef = this.dialogService.openConfirmDialog(
          {titulo:"Info", mensaje: "Se han encontrado donaciones que podrían estar relacionadas a su necesidad. ¿Quieres verlas?", botonConfirm: 'Si', botonCancel: 'No'}
          );
        dialogRef.subscribe(res => {
            if(res){
              console.log('Ir a Donaciones Cercanas filtradas por este titulo:'+ val.titulo);
              this.router.navigateByUrl("/donacionescercanas/"+val.titulo);
              return;
            }
            else{
              this.Necesidadeservice.addNecesidad(val).subscribe(res=>{
                let dialogRef = this.dialogService.openAcceptDialog(
                  {titulo:"Info", mensaje: "Necesidad registrada con éxito", botonConfirm: 'Aceptar', botonCancel: 'NA'}
                  );
                return;
              })              
            }
          })
        }
        else{
          this.Necesidadeservice.addNecesidad(val).subscribe(res=>{
            let dialogRef = this.dialogService.openAcceptDialog(
              {titulo:"Info", mensaje: "Necesidad registrada con éxito", botonConfirm: 'Aceptar', botonCancel: 'NA'}
              );
          })    
        }
      })
      this.limpiarForm();
    }
    else
    {
      let dialogRef = this.dialogService.openAcceptDialog(
          {titulo:"Info", mensaje: "Se ha alcanzado el límite de necesidades registradas", botonConfirm: 'Aceptar', botonCancel: 'NA'}
          );
    }
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
console.log(this.address);        
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
    })
}
  getDomicilio() {
    return this.servicioPosicion.getDomicilio(this.latitud, this.longitud).then((dom: any) => {
      this.direccion = dom;
      this.address = this.direccion["items"]["0"]["address"]["label"]
      console.log(dom)
      console.log(this.address)
    })
  }

  NoSuperaLimite() {
    return new Promise((resolved, reject) => {
      let flag:boolean;
      const user = {
        ID:this.usuarioService.getUserId(),
        nombreUsuario:"",
        contrasenia:""
      }
        this.Necesidadeservice.getMisNecesidades(user.ID).subscribe(data=>{
          this.misNecesidades=data;
          const today =  new Date();
          const TodayMinus30 =  new Date(today.setDate(today.getDate() -30));
          const FTodayMinus30 = this.dateService.transform(TodayMinus30, 'yyyy-MM-dd')
          const misNecesidadesActivas = this.misNecesidades.filter((necesidad:any) => necesidad["estado"] === 'Disponible')
          console.log(misNecesidadesActivas)
          const misNecesidadesResueltas = this.misNecesidades.filter((necesidad:any) => necesidad["estado"] === 'Resuelto' && new Date(necesidad["fechaCreacion"]) > TodayMinus30)
          console.log(misNecesidadesActivas.length)
          console.log(misNecesidadesResueltas.length)
          console.log(FTodayMinus30)
          if(misNecesidadesActivas.length < 3 && misNecesidadesResueltas.length < 3){flag = true}else{flag=false}
          console.log(flag)
          resolved(flag);
         })
        })
      }
}

