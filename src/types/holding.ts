import { Stock } from "../models/stock";

export type Holding = {
  stock: Stock;
  shares: number;
};
