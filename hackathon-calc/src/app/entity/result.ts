export class result {
  brutto?: number;
  sv?: number;
  lst?: number;
  netto?: number;

}

export class ResultCollection {
  monthly = new result();
  yearly = new result();
  thirteenth = new result();
  fourteenth = new result();
}
