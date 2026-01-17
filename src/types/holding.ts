import { Stock } from "../entities/stock";

export type Holding = {
  stock: Stock;
  shares: number;
};
