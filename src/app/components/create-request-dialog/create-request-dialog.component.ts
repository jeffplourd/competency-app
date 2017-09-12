import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'ca-create-request-dialog',
  templateUrl: './create-request-dialog.component.html',
  styleUrls: ['./create-request-dialog.component.scss']
})
export class CreateRequestDialogComponent implements OnInit {

  newRequestForm = new FormGroup({
    email: new FormControl(),
    message: new FormControl()
  });

  constructor() { }

  ngOnInit() {
  }

}
