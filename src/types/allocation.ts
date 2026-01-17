import { Stock } from "../entities/stock";

export type Allocation = {
  stock: Stock;
  percentage: number;
};
