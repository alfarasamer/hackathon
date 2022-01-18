export class Result {
  brutto = 0;
  sv = 0;
  lst = 0;
  netto = 0;

}

export class ResultCollection {
  monthly = new Result();
  yearly = new Result();
  thirteenth = new Result();
  fourteenth = new Result();
}
