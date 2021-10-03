import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearDonacionComponent } from './Components/crear-donacion/crear-donacion.component';
import { NecesidadesCercanasComponent} from './Components/necesidades-cercanas/necesidades-cercanas.component'
import { PrincipalComponent } from './Components/principal/principal.component';
import { DonacionesCercanasComponent } from './Components/donaciones-cercanas/donaciones-cercanas.component';
import { LoginComponent } from './Components/login/login.component';
import { SolicitudesComponent } from './Components/solicitudes/solicitudes.component';
import { MisNecesidadesComponent } from './Components/mis-necesidades/mis-necesidades.component';
import { MisDonacionesComponent } from './Components/mis-donaciones/mis-donaciones.component';
import { ValorarDonacionComponent } from './Components/valorar-donacion/valorar-donacion.component';
import { ConversacionesComponent } from './Components/conversaciones/conversaciones.component';
import { NotificacionesComponent } from './Components/notificaciones/notificaciones.component';
import { PerfilComponent } from './Components/perfil/perfil.component';
import { SolicitudesRecibidasComponent } from './Components/solicitudes-recibidas/solicitudes-recibidas.component';
import { CrearnecesidadComponent } from './Components/crear-necesidad/crear-necesidad.component';

const routes: Routes = [
{path:'necesidadescercanas', component:NecesidadesCercanasComponent},
{path:'creardonacion', component:CrearDonacionComponent},
{path:'crearnecesidad',component:CrearnecesidadComponent},
{path:'principal', component:PrincipalComponent},
{path:'', component:LoginComponent},
{path:'donacionescercanas', component:DonacionesCercanasComponent},
{path:'solicitud', component:SolicitudesComponent},
{path:'misnecesidades', component:MisNecesidadesComponent},
{path:'misdonaciones', component:MisDonacionesComponent},
{path:'solicitudesrecibidas', component:SolicitudesRecibidasComponent},
{path:'valorardonacion/:id', component:ValorarDonacionComponent},
{path:'conversaciones', component:ConversacionesComponent},
{path:'conversaciones/:id', component:ConversacionesComponent},
{path:'notificaciones', component:NotificacionesComponent},
{path:'perfil', component:PerfilComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
