import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmComponent } from '../Components/dialogs/confirm/confirm.component';
import { AcceptComponent } from '../Components/dialogs/accept/accept.component';
import { DialogConfirm } from '../models/dialogConfirm';


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
    width:'400px',
    disableClose: false
  }).afterClosed();  
}
}
