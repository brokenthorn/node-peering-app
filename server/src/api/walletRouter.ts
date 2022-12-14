import express from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { Money } from "../wallet/Money";
import { WalletService } from "../wallet/WalletService";

/** Input type for transferring money from one wallet to another. */
const TransferMoneyInput = z.object({
  fromOwnerId: z
    .string({
      description: "The ID of the user that will send the money.",
    })
    .cuid(),
  toOwnerId: z
    .string({
      description: "The ID of the user that will receive the money.",
    })
    .cuid(),
  money: z.object({
    units: z
      .number({ description: "Amount of monetary units." })
      .min(0, "Money units was negative."),
    cents: z
      .number({ description: "Amount of monetary cents." })
      .min(0, "Money cents was negative."),
  }),
});

/** Wallet Service instance. */
const walletService = new WalletService();

export const walletRouter = express.Router();

walletRouter.use(
  express.json({
    limit: 100 * 1000,
  })
);

walletRouter.get("/:ownerId/balance", (req, res) => {
  const ownerId = req.params.ownerId;
  const walletBalance = walletService.GetWalletBalance(ownerId);

  if (!walletBalance) {
    res.status(StatusCodes.NOT_FOUND).json({
      error: `No wallet found for user ${ownerId}.`,
    });

    return;
  }

  res.json(walletBalance);
});

walletRouter.post("/:ownerId/create", (req, res) => {
  const ownerId = req.params.ownerId;

  if (ownerId.trim().length === 0) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "The owner ID was empty.",
    });

    return;
  }

  const createResult = walletService.CreateWallet(ownerId);

  if (createResult.isErr()) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: createResult.unwrapErr(),
    });

    return;
  }

  const bonusMoney = Money.Create(100, 0).unwrap();
  const bonusTransferResult = walletService.GiveBonus(bonusMoney, ownerId);

  if (bonusTransferResult.isErr()) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: true,
      warning: `Failed to deposit initial bonus: ${bonusTransferResult.unwrapErr()}`,
    });

    return;
  }

  res.json({
    success: true,
  });
});

walletRouter.post("/transfer", async (req, res) => {
  const body = req.body;

  if (!body) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Empty request body." });

    return;
  }

  let transferMoneyInput;

  try {
    transferMoneyInput = await TransferMoneyInput.parseAsync(body);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json(error);

    return;
  }

  if (
    transferMoneyInput.money.units === 0 &&
    transferMoneyInput.money.cents === 0
  ) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "Requested transfer amount was 0.",
    });

    return;
  }

  const moneyResult = Money.Create(
    transferMoneyInput.money.units,
    transferMoneyInput.money.cents
  );

  if (moneyResult.isErr()) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: moneyResult.unwrapErr(),
    });

    return;
  }

  const transferResult = walletService.Transfer(
    moneyResult.unwrap(),
    transferMoneyInput.fromOwnerId,
    transferMoneyInput.toOwnerId
  );

  if (transferResult.isErr()) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: transferResult.unwrapErr(),
    });

    return;
  }

  res.json({
    success: true,
  });
});
