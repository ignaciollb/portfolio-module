my input: src
analyze the code and generate a plan to handle possible errors and unvalid cases

Error Handling Implementation Plan
Overview
This plan addresses comprehensive error handling and validation for the portfolio management module. After analyzing all source files, I've identified 25+ potential error scenarios that currently lack proper validation and error handling. The current implementation has minimal error handling, which can lead to undefined behavior, silent failures, and incorrect calculations.

User Review Required
IMPORTANT

Validation Approach: This plan proposes adding validation methods that throw errors for invalid inputs. An alternative approach would be to return error objects or use a Result type pattern. Please confirm if throwing errors is acceptable for your use case.

WARNING

Breaking Changes: Adding validation will cause existing code that passes invalid inputs to throw errors instead of silently accepting bad data. This may require updates to calling code.

Identified Error Scenarios
Portfolio Class Errors
Constructor & Setup (3 scenarios)
Empty portfolio name: new Portfolio("") or new Portfolio(null)
Invalid name types: non-string names
Whitespace-only names: new Portfolio(" ")
Stock Operations (8 scenarios)
Adding null/undefined stock:

addStock(null, 10)
Negative shares:

addStock(stock, -5)
Non-integer shares:

addStock(stock, 3.7)
NaN or Infinity shares:

addStock(stock, NaN)
Duplicate stock addition: Adding same stock symbol twice
Setting shares for non-existent stock:

setShares("NONEXISTENT", 10)
Negative shares in setShares:

setShares("META", -10)
Non-numeric shares:

setShares("META", "ten")
Allocation Operations (9 scenarios)
Negative percentage:

setAllocation("META", stock, -20)
Percentage > 100:

setAllocation("META", stock, 150)
Total allocations != 100%: Setting allocations that sum to 80% or 120%
NaN or Infinity percentage:

setAllocation("META", stock, NaN)
Null/undefined stock in allocation:

setAllocation("META", null, 50)
Setting allocation without adding stock first: Business logic inconsistency
Symbol mismatch:

setAllocation("AAPL", metaStock, 50)
where metaStock.symbol = "META"
Empty symbol:

setAllocation("", stock, 50)
Whitespace symbols:

setAllocation(" ", stock, 50)
Rebalance Operations (5 scenarios)
Rebalancing with 0 portfolio value: All stocks have 0 shares
Rebalancing with no allocations set: Empty allocations object
Division by zero: Stock price = 0 in calculations
Stock price returns NaN: Invalid price data
Stock price returns negative value: Invalid market data
Stock Class Errors
Constructor (2 scenarios)
Empty symbol: new Stock("")
Invalid symbol types: new Stock(null) or new Stock(123)
Price Operations (1 scenario)
Invalid price constant: PRICE is not a positive number
Proposed Changes
Custom Error Classes
[NEW]

errors.ts
Create custom error classes for better error handling and debugging:

PortfolioError: Base error class for all portfolio-related errors
ValidationError: For input validation failures (extends PortfolioError)
InvalidStateError: For business logic violations (extends PortfolioError)
CalculationError: For mathematical/calculation errors (extends PortfolioError)
Each error class will include:

Descriptive error messages
Error codes for programmatic handling
Context information (e.g., symbol, value that caused error)
Validation Utilities
[NEW]

validators.ts
Create reusable validation functions:

validateSymbol(symbol: string): Ensures non-empty, trimmed string
validateShares(shares: number): Ensures non-negative, finite, integer
validatePercentage(percentage: number): Ensures 0-100, finite number
validatePrice(price: number): Ensures positive, finite number
validatePortfolioName(name: string): Ensures non-empty, trimmed string
validateStock(stock: Stock): Ensures stock is valid object
validateAllocationsSum(allocations: Record<string, Allocation>): Warns if total != 100%
Entity Updates
[MODIFY]

portfolio.ts
Add validation to all methods:

Constructor (lines 10):

Validate name is non-empty string
Trim whitespace from name
addStock (lines 12-14):

Validate stock is not null/undefined
Validate shares is non-negative integer
Check for duplicate stock and either throw error or update existing
Add optional allowDuplicate parameter
removeStock (lines 16-23):

Validate symbol exists (already returns boolean, but could add warning)
Consider returning removed holding for audit trail
setShares (lines 25-29):

Validate symbol exists (currently silent if not found)
Validate shares is non-negative integer
Throw error if stock doesn't exist instead of silent failure
setAllocation (lines 39-41):

Validate symbol is non-empty
Validate stock is not null
Validate percentage is 0-100
Validate stock.symbol matches the symbol parameter
Optionally warn if total allocations != 100%
rebalance (lines 54-107):

Validate portfolio has allocations before rebalancing
Validate total portfolio value > 0
Validate all stock prices are positive and finite
Handle edge cases where division by zero could occur
Add try-catch around price calculations
[MODIFY]

stock.ts
Add validation to Stock class:

Constructor (line 4):

Validate symbol is non-empty string
Trim and uppercase symbol for consistency
Consider validating against common symbol patterns (e.g., 1-5 uppercase letters)
currentPrice (lines 6-8):

Validate PRICE constant is positive and finite
Consider making this method accept a prices map for real-world use
Add error handling if price lookup fails
Type Enhancements
[MODIFY]

allocation.ts
Add JSDoc comments documenting valid ranges:

/\*\*

- Represents a target allocation for a stock in a portfolio
- @property stock - The stock to allocate
- @property percentage - Target percentage (0-100) of portfolio value
  \*/
  [MODIFY]

holding.ts
Add JSDoc comments:

/\*\*

- Represents an actual stock holding in a portfolio
- @property stock - The stock being held
- @property shares - Number of shares owned (non-negative integer)
  \*/
  Constants
  [MODIFY]

prices.ts
Add validation and documentation:

Add JSDoc explaining this is a placeholder for testing
Consider adding a price validation function
Document that real implementations should use dynamic pricing
Index Exports
[MODIFY]

index.ts
Export new error classes and validators:

export _ from './errors/errors';
export _ from './utils/validators';
Verification Plan
Automated Tests
Unit Tests for Validators
File: tests/validators.test.ts (NEW)

Test each validation function with valid and invalid inputs
Verify error messages and error types
Run with: npm test tests/validators.test.ts
Unit Tests for Custom Errors
File: tests/errors.test.ts (NEW)

Test error class instantiation
Verify error inheritance chain
Verify error codes and messages
Run with: npm test tests/errors.test.ts
Enhanced Portfolio Tests
File: tests/Portfolio.validation.test.ts (NEW)

Test all 28 error scenarios identified above
Verify appropriate errors are thrown
Test boundary conditions (e.g., 0%, 100% allocations)
Run with: npm test tests/Portfolio.validation.test.ts
Enhanced Stock Tests
File: tests/Stock.test.ts (NEW)

Test Stock constructor validation
Test currentPrice error handling
Run with: npm test tests/Stock.test.ts
Existing Tests Verification
File:

tests/Portfolio.rebalance.test.ts
(existing)

Ensure all existing tests still pass
Verify no breaking changes to valid use cases
Run with: npm test tests/Portfolio.rebalance.test.ts
Full Test Suite
Run complete test suite to ensure all tests pass:

npm test
Manual Verification
NOTE

If the automated tests above pass, manual verification may not be necessary. However, you can manually verify by:

Install and Build

npm install
npm run build
Interactive Testing (optional) Create a simple script to test error scenarios interactively:

node -e "const {Portfolio, Stock} = require('./dist'); const p = new Portfolio(''); console.log('Should throw error');"
Type Checking Verify TypeScript types are correct:

npx tsc --noEmit
Implementation Order
Phase 1: Create error classes and validators (no breaking changes)
Phase 2: Add validation to Stock class
Phase 3: Add validation to Portfolio class
Phase 4: Write comprehensive tests
Phase 5: Update documentation and examples
Questions for User
Should validation throw errors or return Result/Either types?
Should

addStock
with duplicate symbol throw error or update existing?
Should allocation total validation be strict (must equal 100%) or lenient (warning only)?
Do you want automatic symbol normalization (uppercase, trim)?
Should there be a "strict mode" vs "lenient mode" for validation?
