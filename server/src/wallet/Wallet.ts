import { Money } from "./Money";

export type WalletTransactionEvent = {
  readonly Date: Date;
  readonly FromOwnerId: string;
  readonly ToOwnerId: string;
  readonly Amount: Money;
};

export type WalletBalance = { units: Number; cents: Number };

export class Wallet {
  private readonly _ownerId: string;
  private _money: Money;
  private _transactionEvents: WalletTransactionEvent[];

  /**
   * Construct a default empty wallet.
   */
  constructor(ownerId: string) {
    if (ownerId.length === 0) throw new Error("ownerId was empty.");
    this._ownerId = ownerId;
    this._money = Money.Zero();
    this._transactionEvents = [];
  }

  private AddMoney(money: Money): boolean {
    let units = this._money.units + money.units;
    let cents = 0;

    const totalCents = this._money.cents + money.cents;
    if (totalCents < 100) {
      cents = totalCents;
    } else {
      const remainingCents = totalCents % 100;
      cents = remainingCents;
      const unitsFromCents = Math.floor(totalCents / 100);
      units += unitsFromCents;
    }

    const newMoney = Money.Create(units, cents);
    if (newMoney) {
      this._money = newMoney;
      return true;
    }
    return false;
  }

  private RemoveMoney(money: Money): boolean {
    if (money.units > this._money.units) return false;
    if (money.units === this._money.units && money.cents > this._money.cents)
      return false;

    const units = this._money.units - money.units;
    const cents = this._money.cents - money.cents;

    const newMoney = Money.Create(units, cents);
    if (newMoney) {
      this._money = newMoney;
      return true;
    }
    return false;
  }

  get OwnerId() {
    return this._ownerId;
  }

  get Balance(): WalletBalance {
    return { units: this._money.units, cents: this._money.cents };
  }

  Receive(money: Money, fromOwnerId: string) {
    if (fromOwnerId.length === 0) throw new Error("fromOwnerId was empty.");

    this.AddMoney(money);

    this._transactionEvents = [
      ...this._transactionEvents,
      {
        Date: new Date(),
        FromOwnerId: fromOwnerId,
        ToOwnerId: this._ownerId,
        Amount: money,
      },
    ];
  }

  Give(money: Money, toOwnerId: string): boolean {
    if (toOwnerId.length === 0) throw new Error("toOwnerId was empty.");
    if (!this.RemoveMoney(money)) return false;

    this._transactionEvents = [
      ...this._transactionEvents,
      {
        Date: new Date(),
        FromOwnerId: this._ownerId,
        ToOwnerId: toOwnerId,
        Amount: money,
      },
    ];

    return true;
  }
}
