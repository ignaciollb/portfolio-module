import { Portfolio } from "../src/entities/portfolio";
import { Stock } from "../src/entities/stock";

describe("Portfolio.rebalance", () => {
  const metaSymbol = "META";
  const applSymbol = "APPL";
  const meta = new Stock(metaSymbol);
  const appl = new Stock(applSymbol);

  it("returns no movements when already balanced", () => {
    const portfolio = new Portfolio("Test");
    portfolio.addStock(meta, 4); // $400
    portfolio.addStock(appl, 6); // $600
    portfolio.setAllocation(metaSymbol, meta, 40);
    portfolio.setAllocation(applSymbol, appl, 60);

    const movements = portfolio.rebalance();
    expect(movements).toEqual([]);
  });

  it("returns sell movement when over-allocated", () => {
    const portfolio = new Portfolio("Test");
    portfolio.addStock(meta, 10); // $1000
    portfolio.addStock(appl, 0); // $0
    portfolio.setAllocation(metaSymbol, meta, 50);
    portfolio.setAllocation(applSymbol, appl, 50);

    // Total value = $1000, target META = $500 (5 shares), so sell 5
    const movements = portfolio.rebalance();
    expect(movements).toEqual([
      { symbol: metaSymbol, shares: 5, type: "sell" },
      { symbol: applSymbol, shares: 5, type: "buy" },
    ]);
  });

  it("returns buy movement when under-allocated", () => {
    const portfolio = new Portfolio("Test");
    portfolio.addStock(meta, 4); // $400
    portfolio.addStock(appl, 6); // $600
    portfolio.setAllocation(metaSymbol, meta, 70);
    portfolio.setAllocation(applSymbol, appl, 30);

    // total value = $1000, target META = $700 (7 shares), so buy 3
    const movements = portfolio.rebalance();
    expect(movements).toEqual([
      { symbol: metaSymbol, shares: 3, type: "buy" },
      { symbol: applSymbol, shares: 3, type: "sell" },
    ]);
  });

  it("returns buy movement for allocation to a not owned stock", () => {
    const portfolio = new Portfolio("Test");
    portfolio.addStock(meta, 10); // $1000
    portfolio.setAllocation(metaSymbol, meta, 50);
    portfolio.setAllocation(applSymbol, appl, 50);

    // Total value = $1000, target APPL = $500 (5 shares), so buy 5
    const movements = portfolio.rebalance();
    expect(movements).toEqual([
      { symbol: metaSymbol, shares: 5, type: "sell" },
      { symbol: applSymbol, shares: 5, type: "buy" },
    ]);
  });

  it("returns movements for total allocation to one stock from multiple stocks", () => {
    const portfolio = new Portfolio("Test");
    portfolio.addStock(meta, 7); // $700
    portfolio.addStock(appl, 6); // $600
    portfolio.setAllocation(metaSymbol, meta, 100);

    // Should sell all 6 shares
    const movements = portfolio.rebalance();
    expect(movements).toEqual([
      { symbol: metaSymbol, shares: 6, type: "buy" },
      { symbol: applSymbol, shares: 6, type: "sell" },
    ]);
  });
});
