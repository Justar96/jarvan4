import type { Jar4Config } from "jar4/plugin-sdk";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "jar4/plugin-sdk";
import { normalizeBlueBubblesServerUrl, type BlueBubblesAccountConfig } from "./types.js";

export type ResolvedBlueBubblesAccount = {
  accountId: string;
  enabled: boolean;
  name?: string;
  config: BlueBubblesAccountConfig;
  configured: boolean;
  baseUrl?: string;
};

function listConfiguredAccountIds(cfg: Jar4Config): string[] {
  const accounts = cfg.channels?.bluebubbles?.accounts;
  if (!accounts || typeof accounts !== "object") return [];
  return Object.keys(accounts).filter(Boolean);
}

export function listBlueBubblesAccountIds(cfg: Jar4Config): string[] {
  const ids = listConfiguredAccountIds(cfg);
  if (ids.length === 0) return [DEFAULT_ACCOUNT_ID];
  return ids.sort((a, b) => a.localeCompare(b));
}

export function resolveDefaultBlueBubblesAccountId(cfg: Jar4Config): string {
  const ids = listBlueBubblesAccountIds(cfg);
  if (ids.includes(DEFAULT_ACCOUNT_ID)) return DEFAULT_ACCOUNT_ID;
  return ids[0] ?? DEFAULT_ACCOUNT_ID;
}

function resolveAccountConfig(
  cfg: Jar4Config,
  accountId: string,
): BlueBubblesAccountConfig | undefined {
  const accounts = cfg.channels?.bluebubbles?.accounts;
  if (!accounts || typeof accounts !== "object") return undefined;
  return accounts[accountId] as BlueBubblesAccountConfig | undefined;
}

function mergeBlueBubblesAccountConfig(
  cfg: Jar4Config,
  accountId: string,
): BlueBubblesAccountConfig {
  const base = (cfg.channels?.bluebubbles ?? {}) as BlueBubblesAccountConfig & {
    accounts?: unknown;
  };
  const { accounts: _ignored, ...rest } = base;
  const account = resolveAccountConfig(cfg, accountId) ?? {};
  const chunkMode = account.chunkMode ?? rest.chunkMode ?? "length";
  return { ...rest, ...account, chunkMode };
}

export function resolveBlueBubblesAccount(params: {
  cfg: Jar4Config;
  accountId?: string | null;
}): ResolvedBlueBubblesAccount {
  const accountId = normalizeAccountId(params.accountId);
  const baseEnabled = params.cfg.channels?.bluebubbles?.enabled;
  const merged = mergeBlueBubblesAccountConfig(params.cfg, accountId);
  const accountEnabled = merged.enabled !== false;
  const serverUrl = merged.serverUrl?.trim();
  const password = merged.password?.trim();
  const configured = Boolean(serverUrl && password);
  const baseUrl = serverUrl ? normalizeBlueBubblesServerUrl(serverUrl) : undefined;
  return {
    accountId,
    enabled: baseEnabled !== false && accountEnabled,
    name: merged.name?.trim() || undefined,
    config: merged,
    configured,
    baseUrl,
  };
}

export function listEnabledBlueBubblesAccounts(cfg: Jar4Config): ResolvedBlueBubblesAccount[] {
  return listBlueBubblesAccountIds(cfg)
    .map((accountId) => resolveBlueBubblesAccount({ cfg, accountId }))
    .filter((account) => account.enabled);
}
