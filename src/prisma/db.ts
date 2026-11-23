import "temporal-polyfill/global";
import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";
import { config } from "../config.js";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

const contract = contractFromJson<Contract>(contractJson);

export function createDatabase() {
  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  return postgres({
    contract,
    url: config.databaseUrl,
  });
}

export type Database = ReturnType<typeof createDatabase>;
