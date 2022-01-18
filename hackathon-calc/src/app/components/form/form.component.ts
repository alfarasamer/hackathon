import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {form} from "../../entity/form";
import {CalculationService} from "../../service/calculation.service";
import {result, ResultCollection} from "../../entity/result";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  inputForm: FormGroup;
  result = new ResultCollection();
  constructor(
    private formBuilder: FormBuilder, private calculationService: CalculationService
  ) {

    this.inputForm = this.formBuilder.group({
      income: [0, [Validators.required, Validators.min(0)]],
      children: [0, [Validators.required, Validators.min(0)]],
      loneParent: [false, []],
      commute: ['klein', []],
      commuteDist: [0, [Validators.min(0)]],
      fabo17: [0, [Validators.min(0)]],
      fabo18: [0, [Validators.min(0)]]
    })
  }

  ngOnInit(): void {
  }

  checkLoneParent() {
    this.inputForm.value.loneParent = !this.inputForm.value.loneParent;
  }

  onSubmit(): void {
    let outputForm = new form();
    if (this.inputForm.valid) {
      outputForm.income = this.inputForm.value.income;
      outputForm.children = this.inputForm.value.children;
      outputForm.loneParent = this.inputForm.value.loneParent;
      outputForm.commute = this.inputForm.value.commute;
      outputForm.commuteDist = this.inputForm.value.commuteDist;
      outputForm.fabo17 = this.inputForm.value.fabo17;
      outputForm.fabo18 = this.inputForm.value.fabo18;
      console.log(outputForm);

      this.result = this.calculationService.calculate(outputForm);
    } else {
      console.log("Invalid input")
    }
  }

  showHelp(): void {
    let msg = "Brutto Netto Rechner\n\n"+
    "Allgemeines:\nDer Online Brutto Netto Rechner berechnet unter Betrachtung diverser Faktoren, wie dem Einkommen, den Anzahl der Kindern sowie der Pendlerpauschale die Brutto-, Sozialversicherungs-, Lohnsteuer- und Nettobeträge des Einkommens. Alle erwähnten Beträge dienen \n"+
    "\nEingabe:\nEinkommen: Das Einkommen kann monatlich oder jährlich angegeben werden.\n"+
    "\nKinder: Eingabe einer Zahl; AVAB/AEAB bedeutet Alleinverdiener- und Alleinerzieherabsetzbetrag und reduziert die Lohnsteuer\n"+
    "\nPendlerpauschale: Die Pendlerpauschale wird in klein und groß differenziert. Das kleine Pendlerpauschale gilt für Arbeitnehmerinnen/Arbeitnehmer, deren Arbeitsplatz ohne Aufrundung mindestens 20 Kilometer von der Wohnung entfernt ist und denen die Benützung eines öffentlichen Verkehrsmittels möglich und zumutbar ist."+
    "Das große Pendlerpauschale gilt für Arbeitnehmerinnen/Arbeitnehmer, deren Arbeitsplatz ohne Aufrundung mindestens zwei Kilometer von der Wohnung entfernt ist, denen aber die Benützung eines öffentlichen Verkehrsmittels nicht möglich oder nicht zumutbar ist.";
    alert(msg);
  }
}
