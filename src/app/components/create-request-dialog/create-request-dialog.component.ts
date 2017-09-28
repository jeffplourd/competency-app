import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MdDialogRef } from '@angular/material';
import { UserService } from '../../services/user/user.service';

enum IdentifierStates {
  Loading,
  NeedsInput,
  KnownUser,
  AnonUser
}

@Component({
  selector: 'ca-create-request-dialog',
  templateUrl: './create-request-dialog.component.html',
  styleUrls: ['./create-request-dialog.component.scss']
})
export class CreateRequestDialogComponent {

  isLinear = true;
  evaluatorId;
  displayName;
  phoneNumber;
  identifierState: IdentifierStates = IdentifierStates.NeedsInput;
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
    public dialogRef: MdDialogRef<CreateRequestDialogComponent>,
    public userService: UserService
  ) {
    this.createForm();
  }

  createForm() {

    this.firstFormGroup = this.formBuilder.group({
      phoneNumber: ['', Validators.required],
      name: ''
    });

    this.secondFormGroup = this.formBuilder.group({
      message: ['', Validators.required]
    });

    this.firstFormGroup
      .valueChanges
      .subscribe(({phoneNumber}) => {
        if (phoneNumber.length === 10) {
          console.log('check');
          this.phoneNumber = phoneNumber;
          this.identifierState = IdentifierStates.Loading;
          this.userService.getByPhoneNumber(phoneNumber)
            .subscribe(({id, displayName}) => {
              if (id) {
                this.evaluatorId = id;
                this.displayName = displayName;
                this.identifierState = IdentifierStates.KnownUser;
              }
              else {
                this.identifierState = IdentifierStates.AnonUser;
              }
            });
        }
        console.log('value changed: ', phoneNumber);
      });
  }

  verifyNumber(phoneNumber) {
    return this.userService.getByPhoneNumber(phoneNumber);
  }

  send() {
    this.dialogRef.close({
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      evaluatorId: this.evaluatorId
    });
  }
}
