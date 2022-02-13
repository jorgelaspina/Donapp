import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NecesidadesCercanasComponent } from './Components/necesidades-cercanas/necesidades-cercanas.component';
import { ServicioSharedService } from './services/servicio-shared.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PrincipalComponent } from './Components/principal/principal.component';
import { CrearDonacionComponent } from './Components/crear-donacion/crear-donacion.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DonacionesCercanasComponent } from './Components/donaciones-cercanas/donaciones-cercanas.component';
import { LoginComponent } from './Components/login/login.component';
import { HeaderComponent } from './Components/header/header.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ConfirmComponent } from './Components/dialogs/confirm/confirm.component';
import { SolicitudService } from './services/solicitud.service';
import { SolicitudesComponent } from './Components/solicitudes/solicitudes.component';
import { MatMenuModule } from '@angular/material/menu';
import { MisNecesidadesComponent } from './Components/mis-necesidades/mis-necesidades.component';
import { MisDonacionesComponent } from './Components/mis-donaciones/mis-donaciones.component';
import { SolicitudesRecibidasComponent } from './Components/solicitudes-recibidas/solicitudes-recibidas.component';
import { ValorarDonacionComponent } from './Components/valorar-donacion/valorar-donacion.component';
import { ConversacionesComponent } from './Components/conversaciones/conversaciones.component';
import { NotificacionesComponent } from './Components/notificaciones/notificaciones.component';
import { PerfilComponent } from './Components/perfil/perfil.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { PosicionService } from './services/posicion.service';
import { CrearnecesidadComponent } from './Components/crear-necesidad/crear-necesidad.component';
import { AcceptComponent } from './Components/dialogs/accept/accept.component';
import { MisSolicitudesComponent } from './Components/mis-solicitudes/mis-solicitudes.component';
import { DatePipe } from '@angular/common';
import { OfrecimientosRecibidosComponent } from './Components/ofrecimientos-recibidos/ofrecimientos-recibidos.component';
import { HistorialComponent } from './Components/dialogs/historial/historial.component';



@NgModule({
  declarations: [
    AppComponent,
    NecesidadesCercanasComponent,
    PrincipalComponent,
    CrearDonacionComponent,
    DonacionesCercanasComponent,
    LoginComponent,
    HeaderComponent,
    ConfirmComponent,
    HistorialComponent,
    SolicitudesComponent,
    MisNecesidadesComponent,
    MisDonacionesComponent,
    SolicitudesRecibidasComponent,
    OfrecimientosRecibidosComponent,
    ValorarDonacionComponent,
    ConversacionesComponent,
    NotificacionesComponent,
    PerfilComponent,
    CrearnecesidadComponent,
    AcceptComponent,
    MisSolicitudesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatGridListModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
      MatCarouselModule.forRoot()
  ],
  providers: [ServicioSharedService,SolicitudService,PosicionService,DatePipe,],
  bootstrap: [AppComponent]
})
export class AppModule { }
