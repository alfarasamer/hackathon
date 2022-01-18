export class result {
  id?: number;
  brutto?: number;
  sv?: number;
  lst?: number;
  netto?: number;

}

export class ResultCollection {
  monthly?: result;
  yearly?: result;
  thirteenth?: result;
  fourteenth?: result;
}
