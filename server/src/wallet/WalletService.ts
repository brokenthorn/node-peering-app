import { TupleResult } from "../utils";
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
   * @returns A {@link TupleResult}.
   */
  CreateWallet(ownerId: string): TupleResult {
    if (ownerId.length === 0) throw new Error("ownerId was empty.");

    if (this._wallets.has(ownerId))
      return [false, `A wallet for owner with ID "${ownerId}" already exists.`];

    const wallet = new Wallet(ownerId);
    this._wallets.set(ownerId, wallet);
    return [true];
  }

  GetWalletBalance(ownerId: string): WalletBalance | undefined {
    const wallet = this._wallets.get(ownerId);
    if (!wallet) return;

    return wallet.Balance;
  }

  Transfer(money: Money, fromOwnerId: string, toOwnerId: string): TupleResult {
    const fromWallet = this.GetWallet(fromOwnerId);
    if (!fromWallet) return [false, "Source wallet does not exist."];

    const toWallet = this.GetWallet(toOwnerId);
    if (!toWallet) return [false, "Destination wallet does not exist"];

    // TODO: The follownig two operations (Give and Receive) should be guarranteed to be one atomic transaction!

    const gave = fromWallet.Give(money, toOwnerId);

    if (gave[0] === false) {
      return [
        false,
        `Failed to give ${money.toString()} from owner "${fromOwnerId}" to owner "${toOwnerId}". ${
          gave[1]
        }`,
      ];
    }

    toWallet.Receive(money, fromOwnerId);

    return [true];
  }
}
