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

  CreateWallet(ownerId: string): [boolean, string?] {
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

  Transfer(
    money: Money,
    fromOwnerId: string,
    toOwnerId: string
  ): [boolean, string?] {
    const fromWallet = this.GetWallet(fromOwnerId);
    if (!fromWallet) return [false, "Source wallet does not exist."];

    const toWallet = this.GetWallet(toOwnerId);
    if (!toWallet) return [false, "Destination wallet does not exist"];

    const gave = fromWallet.Give(money, toOwnerId);
    if (!gave)
      return [
        false,
        `Source wallet of owner "${fromOwnerId}" does not have enough money to give out ${money.toString()} to user "${toOwnerId}".`,
      ];

    toWallet.Receive(money, fromOwnerId);

    return [true];
  }
}
