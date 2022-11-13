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

  if (createResult[0] !== true) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: createResult[1],
    });
    return;
  }

  res.json({
    success: true,
  });
});

walletRouter.post("/transfer", async (req, res) => {
  const body = req.body;
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

  const money = Money.Create(
    transferMoneyInput.money.units,
    transferMoneyInput.money.cents
  );

  if (!money) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "Invalid money amount.",
    });
    return;
  }

  const transferResult = walletService.Transfer(
    money,
    transferMoneyInput.fromOwnerId,
    transferMoneyInput.toOwnerId
  );

  if (transferResult[0] !== true) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: transferResult[1],
    });
    return;
  }

  res.json({
    success: true,
  });
});
