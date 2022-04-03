import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmComponent } from '../Components/dialogs/confirm/confirm.component';
import { AcceptComponent } from '../Components/dialogs/accept/accept.component';
import { HistorialComponent } from '../Components/dialogs/historial/historial.component';
import { FotoArticuloComponent } from '../Components/dialogs/fotoArticulo/fotoArticulo.component';
import { DialogConfirm } from '../models/dialogConfirm';
import { DialogHistorial } from '../models/dialogHistorial';
import { DialogFoto } from '../models/dialogFoto';


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

openConfirmDialog(data: DialogConfirm): Observable<boolean> {
  return this.dialog.open(ConfirmComponent, {
    data,
    width:'400px',
    disableClose: false
  }).afterClosed();  
}

openAcceptDialog(data: DialogConfirm): Observable<boolean> {
  return this.dialog.open(AcceptComponent, {
    data,
    width:'80%',
    disableClose: false
  }).afterClosed();  
}
openHistorialDialog(data: DialogHistorial): Observable<boolean> {
  return this.dialog.open(HistorialComponent, {
    data,
    width:'100%',
    disableClose: false
  }).afterClosed();  
}
openFotoDialog(data: DialogFoto): Observable<boolean> {
  return this.dialog.open(FotoArticuloComponent, {
    data,
    width:'100%',
    disableClose: false
  }).afterClosed();  
}
}
