import { Component, Input, OnInit } from '@angular/core'
import { Usuario } from 'src/app/models/usuario';
import { Persona } from 'src/app/models/persona';
import { UsuarioService } from '../../services/usuario.service';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { EMPTY } from 'rxjs';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  @Input()
  usuario: Persona = new Persona;
  fotoPath:string='http://localhost:55481/fotosPerfil/';
  fotoName:string='';
  fotoFullName:string='';
  nuevaContrasenia:string='';
  constructor(
    private usuarioService: UsuarioService,

  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
    //this.fotoName = this.usuario.ID
  }

  cargarPerfil(){
    this.usuarioService.getDatosUsuario().subscribe(res=>{
      this.usuario = res[0];
      this.fotoName = res[0].ID+'.jpg';
      this.fotoFullName = this.fotoPath+this.fotoName;
    
    console.log(res)
    console.log(this.fotoName)
    });
  }

  editarUsuario(){
    const val = {
      ID:this.usuario.ID,
      apellido:this.usuario.apellido,
      nombre:this.usuario.nombre,
      dni:this.usuario.dni,
      fechaNac:this.usuario.fechaNac,
      email:this.usuario.email,
      telefono:this.usuario.telefono,
      contrasenia:this.nuevaContrasenia
    }
    console.log(val);
    this.usuarioService.editarUsuario(val).subscribe(res=>{
    alert(res)
    console.log("res: "+ res)
    });
  }

  subirFotoPerfil(event:any)  
  {
    this.fotoFullName='';
    var foto=event.target.files[0];
    const formData:FormData=new FormData();
    formData.append('uploadedFile', foto, this.fotoName)
    this.usuarioService.subirFoto(formData).subscribe((data:any)=>{
    this.fotoFullName = this.fotoPath+this.fotoName;
    })
  }

}
