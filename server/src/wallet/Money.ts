export class Money {
  private _units: number = 0;
  public get units(): number {
    return this._units;
  }

  private _cents: number = 0;
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

  static Create(units: number, cents: number): Money | undefined {
    if (!Number.isInteger(units) || !Number.isInteger(cents)) return;
    return new Money(units, cents);
  }

  static Zero(): Money {
    return new Money(0, 0);
  }

  toString() {
    return `${this.units} monetary units and ${this.cents} cents`;
  }
}
