import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogFoto } from 'src/app/models/dialogFoto';

@Component({
  selector: 'app-confirm',
  templateUrl: './fotoArticulo.component.html',
  styleUrls: ['./fotoArticulo.component.css']
})
export class FotoArticuloComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogFoto) { }

  ngOnInit(): void {
  }
}