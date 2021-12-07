import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  inputForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.inputForm = this.formBuilder.group({
      income: [0, [Validators.required, Validators.min(0)]],
      children: [0, [Validators.required, Validators.min(0)]],
      loneParent: [false, []],
      commute: ['klein', []],
      commuteDistance: [0, [Validators.min(0)]],
      fabo17: [0, [Validators.min(0)]],
      fabo18: [0, [Validators.min(0)]]
    })
  }

  ngOnInit(): void {
  }

  onSubmit(): void {

  }
}
