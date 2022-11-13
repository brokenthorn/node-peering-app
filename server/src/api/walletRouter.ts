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
const ws = new WalletService();

export const walletRouter = express.Router();

walletRouter.get(":ownerId/balance", (req, res) => {
  const ownerId = req.params.ownerId;
  const walletBalance = ws.GetWalletBalance(ownerId);

  if (!walletBalance) {
    res.status(StatusCodes.NOT_FOUND).json({
      error: `No wallet found for user ${ownerId}.`,
    });
  } else {
    res.json(walletBalance);
  }
});

walletRouter.post(":ownerId/create", (req, res) => {
  const ownerId = req.params.ownerId;

  if (ownerId.trim().length === 0) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "The owner ID was empty.",
    });
  } else {
    const createResult = ws.CreateWallet(ownerId);

    if (createResult[0] === true) {
      res.json({
        success: true,
      });
    }
  }
});

walletRouter.post("transfer", async (req, res) => {
  const body = req.body;

  try {
    const transferMoneyInput = await TransferMoneyInput.parseAsync(body);

    if (
      transferMoneyInput.money.units === 0 &&
      transferMoneyInput.money.cents === 0
    ) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: "Requested transfer amount was 0.",
      });
    } else {
      const money = Money.Create(
        transferMoneyInput.money.units,
        transferMoneyInput.money.cents
      );

      if (!money) {
        res.status(StatusCodes.BAD_REQUEST).json({
          error: "Invalid money amount.",
        });
      } else {
        const transferResult = ws.Transfer(
          money,
          transferMoneyInput.fromOwnerId,
          transferMoneyInput.toOwnerId
        );

        if (transferResult[0]) {
          res.json({
            success: true,
          });
        } else {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: transferResult[1],
          });
        }
      }
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json(error);
  }
});
