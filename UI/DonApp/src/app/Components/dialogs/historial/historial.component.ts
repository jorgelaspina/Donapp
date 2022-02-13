import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogHistorial } from 'src/app/models/dialogHistorial';

@Component({
  selector: 'app-confirm',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogHistorial) { }

  ngOnInit(): void {
  }
}