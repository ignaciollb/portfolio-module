import { PRICE } from "../constants/prices";

export class Stock {
  constructor(public symbol: string) {}

  currentPrice(): number {
    return PRICE;
  }
}
