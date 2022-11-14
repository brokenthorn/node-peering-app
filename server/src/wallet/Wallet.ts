import { Err, Ok, Result } from "@sniptt/monads";
import { IWallet } from "./IWallet";
import { Money } from "./Money";

export type WalletTransactionEvent = {
  readonly Date: Date;
  readonly FromOwnerId: string;
  readonly ToOwnerId: string;
  readonly Amount: Money;
};

/** A wallet's balance in monetary units and cents. */
export type WalletBalance = { units: number; cents: number };

/**
 * A wallet is an aggregate that holds money.
 * It can
 */
export class Wallet implements IWallet {
  private readonly _ownerId: string;
  private _money: Money;
  private _transactionEvents: WalletTransactionEvent[];

  /**
   * Construct a default empty wallet.
   */
  constructor(ownerId: string) {
    if (ownerId.length === 0) {
      throw new Error("ownerId was empty.");
    }

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

    const newMoneyResult = Money.Create(units, cents);

    if (newMoneyResult.isOk()) {
      this._money = newMoneyResult.unwrap();

      return true;
    }

    return false;
  }

  private RemoveMoney(money: Money): Result<undefined, string> {
    const totalCents = this._money.cents + this._money.units * 100;
    const totalCentsToRemove = money.cents + money.units * 100;

    if (totalCentsToRemove > totalCents) {
      return Err(
        `Not enough money in the wallet to remove ${money.toString()}.`
      );
    }

    const remainingTotalCents = totalCents - totalCentsToRemove;
    const remainingUnits = Math.floor(remainingTotalCents / 100);
    const remainingCents = remainingTotalCents % 100;
    const remainingMoneyResult = Money.Create(remainingUnits, remainingCents);

    if (remainingMoneyResult.isOk()) {
      this._money = remainingMoneyResult.unwrap();

      return Ok(undefined);
    }

    return Err(remainingMoneyResult.unwrapErr());
  }

  get OwnerId() {
    return this._ownerId;
  }

  get Balance(): WalletBalance {
    return { units: this._money.units, cents: this._money.cents };
  }

  Receive(money: Money, fromOwnerId: string): void {
    if (fromOwnerId.length === 0) {
      throw new Error("fromOwnerId was empty.");
    }

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

  Give(money: Money, toOwnerId: string): Result<undefined, string> {
    if (toOwnerId.length === 0) {
      throw new Error("toOwnerId was empty.");
    }

    const removeResult = this.RemoveMoney(money);

    if (removeResult.isErr()) {
      return Err(
        `Failed to give owner "${toOwnerId}" money: ${removeResult.unwrapErr()}`
      );
    }

    this._transactionEvents = [
      ...this._transactionEvents,
      {
        Date: new Date(),
        FromOwnerId: this._ownerId,
        ToOwnerId: toOwnerId,
        Amount: money,
      },
    ];

    return Ok(undefined);
  }
}
