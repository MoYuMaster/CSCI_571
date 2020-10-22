export class Stock {
  constructor(public ticker: string, public name: string) {}
}

export interface StockResponse {
  total: number;
  results: Stock[];
}
