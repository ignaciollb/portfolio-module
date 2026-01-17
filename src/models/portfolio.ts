import { Allocation } from "../types/allocation";
import { Holding } from "../types/holding";
import { Movement } from "../types/movements";
import { Stock } from "./stock";

export class Portfolio {
  private holdings: Record<string, Holding> = {};
  private allocations: Record<string, Allocation> = {};

  constructor(public name: string) {}

  addStock(stock: Stock, shares: number = 0): void {
    this.holdings[stock.symbol] = { stock, shares };
  }

  removeStock(symbol: string): boolean {
    if (this.holdings[symbol]) {
      delete this.holdings[symbol];
      delete this.allocations[symbol];
      return true;
    }
    return false;
  }

  setShares(symbol: string, shares: number): void {
    if (this.holdings[symbol]) {
      this.holdings[symbol].shares = shares;
    }
  }

  getShares(symbol: string): number | undefined {
    return this.holdings[symbol]?.shares;
  }

  getStocks(): Stock[] {
    return Object.values(this.holdings).map((h) => h.stock);
  }

  setAllocation(symbol: string, stock: Stock, percentage: number): void {
    this.allocations[symbol] = { stock, percentage };
  }

  getAllocation(symbol: string): number | undefined {
    return this.allocations[symbol]?.percentage;
  }

  getAllocations(): Record<string, Allocation> {
    return { ...this.allocations };
  }

  /**
   * Returns an array of movements (buy/sell) to rebalance the portfolio to match allocations.
   */
  rebalance(): Movement[] {
    const movements: Movement[] = [];
    const totalPortfolioValue = Object.values(this.holdings).reduce(
      (sum, holding) => {
        return sum + holding.shares * holding.stock.currentPrice();
      },
      0,
    );

    for (const symbol in this.allocations) {
      const { stock, percentage } = this.allocations[symbol];
      const holding = this.holdings[symbol];
      const price = stock.currentPrice();
      const targetValue = (percentage / 100) * totalPortfolioValue;
      const actualValue = holding ? holding.shares * price : 0;

      if (targetValue < actualValue && holding) {
        const sharesToSell = holding.shares - Math.floor(targetValue / price);
        if (sharesToSell > 0) {
          movements.push({
            symbol,
            shares: sharesToSell,
            type: "sell",
          });
        }
      } else if (targetValue > actualValue) {
        const sharesToBuy =
          Math.floor(targetValue / price) - (holding?.shares ?? 0);
        if (sharesToBuy > 0) {
          movements.push({
            symbol,
            shares: sharesToBuy,
            type: "buy",
          });
        }
      }
    }
    return movements;
  }
}
