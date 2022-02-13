import { Component, Input, OnInit } from '@angular/core';
import { Persona } from 'src/app/models/persona';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  @Input()
  usuario: Persona = new Persona;
  fotoPath:string='http://localhost:55481/fotosPerfil/';
  fotoName:string='';
  fotoFullName:string='';

  constructor(
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.usuarioService.getDatosUsuario().subscribe(res=>{
      this.usuario = res[0];
      this.fotoName = res[0].ID+'.jpg';
      this.fotoFullName = this.fotoPath+this.fotoName;
    });
  }
}
