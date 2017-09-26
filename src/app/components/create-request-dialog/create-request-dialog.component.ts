import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'ca-create-request-dialog',
  templateUrl: './create-request-dialog.component.html',
  styleUrls: ['./create-request-dialog.component.scss']
})
export class CreateRequestDialogComponent {

  newRequestForm: FormGroup;

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  static open(dialog) {
    return dialog.open(CreateRequestDialogComponent, {
      width: '80vw',
      disableClose: false
    });
  }

  constructor(
    public formBuilder: FormBuilder,
    public dialogRef: MdDialogRef<CreateRequestDialogComponent>
  ) {
    this.createForm();
  }

  createForm() {
    // this.newRequestForm = this.formBuilder.group({
    //   email: ['', Validators.email],
    //   message: ['', Validators.required]
    // });

    this.firstFormGroup = this.formBuilder.group({
      email: ['', Validators.email]
    });

    this.secondFormGroup = this.formBuilder.group({
      message: ['', Validators.required]
    });
  }

  send() {
    console.log({
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value
    });
    this.dialogRef.close({
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value
    });
  }
}
