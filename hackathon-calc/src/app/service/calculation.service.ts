import {Injectable} from '@angular/core';
import {result} from "../entity/result";
import {ResultCollection} from "../entity/result";
import {form} from "../entity/form";


@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  constructor() {
  }

  calculate(form: form): ResultCollection {
    let r = new ResultCollection();

    let income = form.income
    console.log(income)

    let sv = this.sV(income)
    console.log(sv)

    let remaining = income - sv;

    console.log(this.incomeTax(remaining, 0, form.children, form.fabo17, form.fabo18))

    return r;
  }

  private incomeTax(grossMonthlyIncome: number, alreadyTaxed: number, children: number, fabo17: number, fabo18: number): number {
    let remaining = grossMonthlyIncome
    let tax = 0
    let lowerTaxBracketBound = 0

    for (let t of taxGroups) {
      if (alreadyTaxed <= lowerTaxBracketBound) {
        const amount = Math.min(t.width, remaining)
        alreadyTaxed += amount
        remaining -= amount
        tax += t.rate * amount
      }
      lowerTaxBracketBound += t.width
    }

    tax += 0.55 * remaining

    //AVAB/AEAB deductions
    if (children == 1) {
      tax-= 494;
    }
    if (children == 2) {
      tax-=669;
    }
    if (children >= 3) {
      for (let i = 3; i <= children; i++) {
        tax-= 220;
      }
    }
    //fabo17 deduction
    if (fabo17 > 0) {
      for (let i = 1; i <= fabo17; i++) {
        tax -=125;
      }
    }
    //fabo18 deduction
    if (fabo18 > 0) {
      for (let i = 1; i <= fabo18; i++) {
        tax -=41.68;
      }
    }

    return tax <= 0? 0:tax;
  }

  private bonusTax(monthlyIncomeWithoutSv: number, alreadyTaxedBonus: number): number {
    let alreadyTaxed = alreadyTaxedBonus
    let remaining = monthlyIncomeWithoutSv
    let tax = 0
    let lowerTaxBracketBound = 0

    for (let t of bonusTaxGroups) {
      if (alreadyTaxed <= lowerTaxBracketBound) {
        const amount = Math.min(t.width, remaining)
        alreadyTaxed += amount
        remaining -= amount
        tax += t.rate * amount
      }
      lowerTaxBracketBound += t.width
    }

    tax += this.incomeTax(remaining, alreadyTaxed, 0, 0, 0)

    return tax
  }

  private sV(monthlyIncome: number): number {
    if (monthlyIncome <= 475.86) {
      return 0;
    } else if (monthlyIncome <= 1790) {
      return monthlyIncome * 0.1512;
    } else if (monthlyIncome <= 1953) {
      return monthlyIncome * 0.1612;
    } else if (monthlyIncome <= 2217) {
      return monthlyIncome * 0.1712;
    } else if (monthlyIncome <= 5550) {
      return monthlyIncome * 0.1912;
    }
    return 1005.66;
  }

  private bonusSV(monthlyIncome: number): number {
    if (monthlyIncome <= 475.86) {
      return 0;
    } else if (monthlyIncome <= 1790) {
      return monthlyIncome * 0.1412;
    } else if (monthlyIncome <= 1953) {
      return monthlyIncome * 0.1512;
    } else if (monthlyIncome <= 2217) {
      return monthlyIncome * 0.1612;
    } else if (monthlyIncome <= 5550) {
      return monthlyIncome * 0.1712;
    }
    return 1900.32;
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
