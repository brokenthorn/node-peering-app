import { Err, Ok, Result } from "@sniptt/monads";
import { Money } from "./Money";
import { Wallet, WalletBalance } from "./Wallet";

export class WalletService {
  private _wallets: Map<string, Wallet>;

  /**
   * Construct a new service instance.
   */
  constructor() {
    this._wallets = new Map<string, Wallet>();
  }

  private GetWallet(ownerId: string): Wallet | undefined {
    return this._wallets.get(ownerId);
  }

  /**
   * Creates a new wallet managed by this service,
   * for the specified owner ID.
   * @param ownerId The owner's unique ID.
   * @returns A {@link Result<undefined, string>}.
   */
  CreateWallet(ownerId: string): Result<undefined, string> {
    if (ownerId.length === 0) {
      throw new Error("ownerId was empty.");
    }

    if (this._wallets.has(ownerId)) {
      return Err(`A wallet for owner with ID "${ownerId}" already exists.`);
    }

    const wallet = new Wallet(ownerId);
    this._wallets.set(ownerId, wallet);

    return Ok(undefined);
  }

  GetWalletBalance(ownerId: string): WalletBalance | undefined {
    const wallet = this._wallets.get(ownerId);

    if (!wallet) {
      return undefined;
    }

    return wallet.Balance;
  }

  Transfer(
    money: Money,
    fromOwnerId: string,
    toOwnerId: string
  ): Result<undefined, string> {
    const fromWallet = this.GetWallet(fromOwnerId);

    if (!fromWallet) {
      return Err("Source wallet does not exist.");
    }

    const toWallet = this.GetWallet(toOwnerId);

    if (!toWallet) {
      return Err("Destination wallet does not exist");
    }

    // TODO: The follownig two operations (Give and Receive) should be guarranteed to be one atomic transaction!

    const giveResult = fromWallet.Give(money, toOwnerId);

    if (giveResult.isErr()) {
      return Err(
        `Failed to give ${money.toString()} from owner "${fromOwnerId}" to owner "${toOwnerId}". ${giveResult.unwrapErr()}`
      );
    }

    toWallet.Receive(money, fromOwnerId);

    return Ok(undefined);
  }
}
