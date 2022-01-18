import {Injectable} from '@angular/core';
import {ResultCollection} from "../entity/result";
import {Form} from "../entity/form";


@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  constructor() {
  }

  calculate(form: Form): ResultCollection {
    let r = new ResultCollection();

    let income = form.income
    console.log(income)

    // monthly
    r.monthly.brutto = income
    r.monthly.sv = this.sV(income)
    let monthlyMinusSv = income - r.monthly.sv;

    let pendlerPauschale = 0
    if (form.largeCommute != undefined && form.commuteDist != undefined) {
      pendlerPauschale = this.pendlerPauschale(form.largeCommute, form.commuteDist);
    }
    r.monthly.lst = this.incomeTax(monthlyMinusSv - pendlerPauschale, 0, form.loneParent, form.children, form.fabo17, form.fabo18)
    r.monthly.netto = income - r.monthly.sv - r.monthly.lst

    // bonus
    r.thirteenth.brutto = income
    r.thirteenth.sv = this.bonusSV(income, 0)
    let thirteenthMinusSv = income - r.thirteenth.sv;
    r.thirteenth.lst = this.bonusTax(thirteenthMinusSv, 0)
    r.thirteenth.netto = income - r.thirteenth.sv - r.thirteenth.lst;

    r.fourteenth.brutto = income
    r.fourteenth.sv = this.bonusSV(income, r.thirteenth.sv)
    let fourteenthMinusSv = income - r.thirteenth.sv;
    r.fourteenth.lst = this.bonusTax(fourteenthMinusSv, thirteenthMinusSv)
    r.fourteenth.netto = income - r.fourteenth.sv - r.fourteenth.lst;


    // yearly
    r.yearly.brutto = income * 14
    r.yearly.netto = 12 * r.monthly.netto + r.thirteenth.netto + r.fourteenth.netto
    r.yearly.lst = 12 * r.monthly.lst + r.thirteenth.lst + r.fourteenth.lst
    r.yearly.sv = 12 * r.monthly.sv + r.thirteenth.sv + r.fourteenth.sv

    return r;
  }

  private incomeTax(grossMonthlyIncome: number, alreadyTaxed: number, avab: boolean, children: number, fabo17: number, fabo18: number): number {
    let remaining = grossMonthlyIncome
    let tax = 0
    let lowerTaxBracketBound = 0

    for (let t of taxGroups) {
      if (alreadyTaxed < lowerTaxBracketBound + t.width) {
        const amount = Math.min(t.width, remaining)
        alreadyTaxed += amount
        remaining -= amount
        tax += t.rate * amount
      }
      lowerTaxBracketBound += t.width
    }

    tax += 0.55 * remaining

    //AVAB/AEAB deductions
    if (avab) {
      if (children == 1) {
        tax -= 494;
      }
      if (children == 2) {
        tax -= 669;
      }
      if (children >= 3) {
        for (let i = 3; i <= children; i++) {
          tax -= 220;
        }
      }
    }

    //fabo17 deduction
    if (fabo17 > 0) {
      for (let i = 1; i <= fabo17; i++) {
        tax -= 125;
      }
    }
    //fabo18 deduction
    if (fabo18 > 0) {
      for (let i = 1; i <= fabo18; i++) {
        tax -= 41.68;
      }
    }

    return tax <= 0 ? 0 : tax;
  }

  private bonusTax(monthlyIncomeWithoutSv: number, alreadyTaxedBonus: number): number {
    if (2 * monthlyIncomeWithoutSv <= 2100) { // Freibetrag
      return 0
    }

    let alreadyTaxed = alreadyTaxedBonus
    let remaining = monthlyIncomeWithoutSv
    let tax = 0
    let lowerTaxBracketBound = 0

    for (let t of bonusTaxGroups) {
      if (alreadyTaxed < lowerTaxBracketBound + t.width) {
        const amount = Math.min(t.width, remaining)
        alreadyTaxed += amount
        remaining -= amount
        tax += t.rate * amount
      }
      lowerTaxBracketBound += t.width
    }

    tax += this.incomeTax(remaining, alreadyTaxed, false, 0, 0, 0)

    return tax
  }

  private sV(monthlyIncome: number): number {
    if (monthlyIncome <= 475.86) {
      return 0;
    } else if (monthlyIncome <= 1790) {
      return monthlyIncome * 0.1512;
    } else if (monthlyIncome <= 1953) {
      return monthlyIncome * 0.1612;
    } else if (monthlyIncome <= 2117) {
      return monthlyIncome * 0.1712;
    } else if (monthlyIncome <= 5550) {
      return monthlyIncome * 0.1912;
    }
    return 1005.66;
  }

  private bonusSV(monthlyIncome: number, alreadyPaidBonusSv: number): number {
    let sv = 0
    if (monthlyIncome <= 475.86) {
      sv = 0;
    } else if (monthlyIncome <= 1790) {
      sv = monthlyIncome * 0.1412;
    } else if (monthlyIncome <= 1953) {
      sv = monthlyIncome * 0.1512;
    } else if (monthlyIncome <= 2117) {
      sv = monthlyIncome * 0.1612;
    } else if (monthlyIncome <= 5550) {
      sv = monthlyIncome * 0.1712;
    } else {
      sv = Math.min(1900.32, monthlyIncome * 0.1712)
    }
    if (sv + alreadyPaidBonusSv > 1900.32) {
      return 1900.32 - alreadyPaidBonusSv
    }
    return sv
  }

  private pendlerPauschale(isBig: boolean, distanceInKm: number): number {
    let pauschale = 0;
    if (isBig) { // Pendler Pauschale gross
      if (distanceInKm >= 60) {
        pauschale = 306;
      } else if (distanceInKm >= 40) {
        pauschale = 214;
      } else if (distanceInKm >= 20) {
        pauschale = 123;
      } else if (distanceInKm >= 2) {
        pauschale = 31;
      }
    } else { // Pendler Pauschale klein
      if (distanceInKm >= 60) {
        pauschale = 168;
      } else if (distanceInKm >= 40) {
        pauschale = 113;
      } else if (distanceInKm >= 20) {
        pauschale = 58;
      }
    }
    return (distanceInKm * 2) / 12 + pauschale;
  }
}

class TaxBracket {

  constructor(width: number, rate: number) {
    this.width = width;
    this.rate = rate;
  }

  width: number
  rate: number
}

const taxGroups = [
  new TaxBracket(1099.33, 0),
  new TaxBracket(1516 - 1099.33, 0.2),
  new TaxBracket(2599.33 - 1516, 0.35),
  new TaxBracket(5016 - 2599.33, 0.42),
  new TaxBracket(7516 - 5016, 0.48),
  new TaxBracket(83349.33 - 7516, 0.5),
]

const bonusTaxGroups = [
  new TaxBracket(620, 0),
  new TaxBracket(24380, 0.06),
  new TaxBracket(25000, 0.27),
  new TaxBracket(33333, 0.3575),
]
