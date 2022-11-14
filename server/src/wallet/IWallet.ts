import { Result } from "@sniptt/monads";
import { Money } from "./Money";
import { WalletBalance } from "./Wallet";

/**
 * Interface for a wallet with basic functionality of receiving and giving money.
 */
export interface IWallet {
  /** Receive money from another user and store it in this wallet. */
  Receive(money: Money, fromOwnerId: string): void;

  /** Remove money from this wallet and give it to another user. */
  Give(money: Money, toOwnerId: string): Result<undefined, string>;

  /** Getter for the current wallet balance. */
  get Balance(): WalletBalance;
}
