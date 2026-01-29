import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { createConfigIO } from "./io.js";

async function withTempHome(run: (home: string) => Promise<void>): Promise<void> {
  const home = await fs.mkdtemp(path.join(os.tmpdir(), "jar4-config-"));
  try {
    await run(home);
  } finally {
    await fs.rm(home, { recursive: true, force: true });
  }
}

async function writeConfig(home: string, dirname: ".jar4", port: number) {
  const dir = path.join(home, dirname);
  await fs.mkdir(dir, { recursive: true });
  const configPath = path.join(dir, "jar4.json");
  await fs.writeFile(configPath, JSON.stringify({ gateway: { port } }, null, 2));
  return configPath;
}

describe("config io compat", () => {
  it("loads config from ~/.jar4/jar4.json", async () => {
    await withTempHome(async (home) => {
      const configPath = await writeConfig(home, ".jar4", 19001);

      const io = createConfigIO({
        env: {} as NodeJS.ProcessEnv,
        homedir: () => home,
      });
      expect(io.configPath).toBe(configPath);
      expect(io.loadConfig().gateway?.port).toBe(19001);
    });
  });

  it("honors explicit config path env override", async () => {
    await withTempHome(async (home) => {
      const defaultConfigPath = await writeConfig(home, ".jar4", 19002);
      const customConfigDir = path.join(home, "custom");
      await fs.mkdir(customConfigDir, { recursive: true });
      const customConfigPath = path.join(customConfigDir, "jar4.json");
      await fs.writeFile(customConfigPath, JSON.stringify({ gateway: { port: 20002 } }, null, 2));

      const io = createConfigIO({
        env: { JAR4_CONFIG_PATH: customConfigPath } as NodeJS.ProcessEnv,
        homedir: () => home,
      });

      expect(io.configPath).not.toBe(defaultConfigPath);
      expect(io.configPath).toBe(customConfigPath);
      expect(io.loadConfig().gateway?.port).toBe(20002);
    });
  });
});
