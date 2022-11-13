import { TupleResult } from "../utils";
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

  private RemoveMoney(money: Money): TupleResult {
    const totalCents = this._money.cents + this._money.units * 100;
    const totalCentsToRemove = money.cents + money.units * 100;

    if (totalCentsToRemove > totalCents) {
      return [
        false,
        `Not enough money in the wallet to remove ${money.toString()}.`,
      ];
    }

    const remainingTotalCents = totalCents - totalCentsToRemove;
    const remainingUnits = Math.floor(remainingTotalCents / 100);
    const remainingCents = remainingTotalCents % 100;
    const remainingMoney = Money.Create(remainingUnits, remainingCents);

    if (remainingMoney !== undefined) {
      this._money = remainingMoney;
      return [true];
    }

    return [
      false,
      "Unspecified error happend while removing money from wallet.",
    ];
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

  Give(money: Money, toOwnerId: string): TupleResult {
    if (toOwnerId.length === 0) throw new Error("toOwnerId was empty.");

    const removeResult = this.RemoveMoney(money);

    if (removeResult[0] === false)
      return [
        false,
        `Failed to give owner "${toOwnerId}" money: ${removeResult[1]}`,
      ];

    this._transactionEvents = [
      ...this._transactionEvents,
      {
        Date: new Date(),
        FromOwnerId: this._ownerId,
        ToOwnerId: toOwnerId,
        Amount: money,
      },
    ];

    return [true];
  }
}
