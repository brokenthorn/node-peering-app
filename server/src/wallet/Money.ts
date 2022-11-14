import { Err, Ok, Result } from "@sniptt/monads";

export class Money {
  private _units = 0;

  public get units(): number {
    return this._units;
  }

  private _cents = 0;

  public get cents(): number {
    return this._cents;
  }

  protected constructor(units: number, cents: number) {
    // add units:
    this._units += units;

    // add cents:
    const totalCents = this._cents + cents;

    if (totalCents < 100) {
      this._cents = totalCents;
    } else {
      // leave less than 100 cents in cents:
      const remainingCents = totalCents % 100;
      this._cents = remainingCents;

      // and convert the rest to full units (e.g. dollars, etc.)
      // and add them to the units pile:
      const unitsFromCents = Math.floor(totalCents / 100);
      this._units += unitsFromCents;
    }
  }

  /**
   * This static factory method attempts to construct a valid {@link Money} instance
   * using the arguments provided.
   * @param units Number of monetary units (integer)
   * @param cents Number of cents (integer)
   * @returns A {@link Result<Money, string>}
   */
  static Create(units: number, cents: number): Result<Money, string> {
    if (!Number.isInteger(units) || !Number.isInteger(cents)) {
      return Err("Units and/or cents were not integers.");
    }

    return Ok(new Money(units, cents));
  }

  /** Constructs a {@link Money} instance with a 0 total value (i.e., no value at all). */
  static Zero(): Money {
    return new Money(0, 0);
  }

  /** Returns a nicely formatted string representing the monetary value of this instance. */
  toString(): string {
    return `${this.units} monetary units and ${this.cents} cents`;
  }
}
