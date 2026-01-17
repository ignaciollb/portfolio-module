import { Stock } from "../models/stock";

export type Allocation = {
  stock: Stock;
  percentage: number;
};
