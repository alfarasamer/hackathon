import { Injectable } from '@angular/core';
import {result} from "../entity/result";
import {form} from "../entity/form";

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  constructor() { }

  calculate(form: form): result {
    let r = new result();



    return r;
  }
}
