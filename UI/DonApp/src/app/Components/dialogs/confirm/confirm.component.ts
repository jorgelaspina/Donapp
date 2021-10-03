import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfirm } from 'src/app/models/dialogConfirm';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogConfirm) { }

  ngOnInit(): void {
  }
}
