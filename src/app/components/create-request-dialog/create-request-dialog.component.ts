import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ca-create-request-dialog',
  templateUrl: './create-request-dialog.component.html',
  styleUrls: ['./create-request-dialog.component.scss']
})
export class CreateRequestDialogComponent {

  newRequestForm: FormGroup;

  constructor(public formBuilder: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.newRequestForm = this.formBuilder.group({
      email: ['', Validators.email],
      message: ['', Validators.required]
    });
  }

}
