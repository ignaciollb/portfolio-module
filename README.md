# Portfolio Management Module

A simple TypeScript module for managing personal investment portfolios.

## Structure

- `src/entities/` — Entities (Portfolio, Stock)
- `src/types/` — Types (Allocation, Holding, Movement)
- `tests/` — Unit tests

## Scripts

- `npm test` — Run tests

## Example

import { Portfolio } from "./src/entities/portfolio";
import { Stock } from "./src/entities/stock";

const portfolio = new Portfolio("My Portfolio");
const stock = new Stock("META");

portfolio.addStock(stock, 10);
portfolio.setAllocation(stock.symbol, stock, 50);

const movements = portfolio.rebalance();
console.log(movements);

## Explanation

I have implemented the Portfolio Management Module in TypeScript, using two ai tools github copilot for the first iteration which i needed more brainstorming and getting ideas that i wanted to validate.
Once the first iteration was done i used antigravity which is an agentic ai tool which was more suitable since i wanted to "autopilot" the refactoring process.

Main concern during the development was how to manage the stock price, i focused on following the instructions, but if i had to do a second iteration of this i would decouple that from the stock and i would'nt need to have the stock in the allocation and holding objects.

The idea of my implementation was to follow this instruction "You’re building a portfolio management module, part of a personal investments and trading app" and create a module that could be used in a bigger system.

For time constraints i decided to simplify:

- test validations of portfolio creation (were i would validate some edge cases like negative values, allocation sum, etc)
- don't support decimal values

i did ask the ai to generate a plan to handle errors and invalid cases, but i didn't have time to implement it. You can find the plan in ai_history/handle errors.md
