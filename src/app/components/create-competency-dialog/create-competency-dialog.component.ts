import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'ca-create-competency-dialog',
  templateUrl: './create-competency-dialog.component.html',
  styleUrls: ['./create-competency-dialog.component.scss']
})
export class CreateCompetencyDialogComponent implements OnInit {

  newCompetencyForm = new FormGroup({
    title: new FormControl(),
    description: new FormControl()
  });


  constructor(
    private dialogRef: MdDialogRef<CreateCompetencyDialogComponent>
  ) { }

  ngOnInit() {
  }

}
