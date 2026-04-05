import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PRIVATE_KEY: z.string().min(1, "PRIVATE_KEY is required"),
  DRY_RUN: z.enum(["true", "false"]).default("true"),
  LOG_LEVEL: z.string().default("info"),
  MAX_POSITION_USD: z.string().default("50"),
  MAX_DAILY_LOSS_USD: z.string().default("25"),
  TAKE_PROFIT_PCT: z.string().default("12"),
  STOP_LOSS_PCT: z.string().default("6"),
  TARGET_WALLETS: z.string().default("0xabc...,0xdef..."),
  MAX_CORRELATED_EXPOSURE_USD: z.string().default("150"),
  COPY_SIZE_MULTIPLIER: z.string().default("0.25"),
});

export const env = envSchema.parse(process.env);

export function buildRuntimeContext() {
  const privateKeyPreview =
    env.PRIVATE_KEY.length <= 10
      ? env.PRIVATE_KEY
      : `${env.PRIVATE_KEY.slice(0, 6)}...${env.PRIVATE_KEY.slice(-4)}`;

  return {
    repo: "polymarket-whale-copy-bot",
    family: "polymarket",
    market: "large trader activity on Polymarket",
    signal: "high-notional fills from preselected wallets",
    dryRun: env.DRY_RUN === "true",
    orderSize: env.MAX_POSITION_USD,
    privateKeyPreview,
  } as const;
}
