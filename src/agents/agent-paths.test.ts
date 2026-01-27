import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { resolveJar4AgentDir } from "./agent-paths.js";

describe("resolveJar4AgentDir", () => {
  const previousStateDir = process.env.JAR4_STATE_DIR;
  const previousAgentDir = process.env.JAR4_AGENT_DIR;
  const previousPiAgentDir = process.env.PI_CODING_AGENT_DIR;
  let tempStateDir: string | null = null;

  afterEach(async () => {
    if (tempStateDir) {
      await fs.rm(tempStateDir, { recursive: true, force: true });
      tempStateDir = null;
    }
    if (previousStateDir === undefined) {
      delete process.env.JAR4_STATE_DIR;
    } else {
      process.env.JAR4_STATE_DIR = previousStateDir;
    }
    if (previousAgentDir === undefined) {
      delete process.env.JAR4_AGENT_DIR;
    } else {
      process.env.JAR4_AGENT_DIR = previousAgentDir;
    }
    if (previousPiAgentDir === undefined) {
      delete process.env.PI_CODING_AGENT_DIR;
    } else {
      process.env.PI_CODING_AGENT_DIR = previousPiAgentDir;
    }
  });

  it("defaults to the multi-agent path when no overrides are set", async () => {
    tempStateDir = await fs.mkdtemp(path.join(os.tmpdir(), "jar4-agent-"));
    process.env.JAR4_STATE_DIR = tempStateDir;
    delete process.env.JAR4_AGENT_DIR;
    delete process.env.PI_CODING_AGENT_DIR;

    const resolved = resolveJar4AgentDir();

    expect(resolved).toBe(path.join(tempStateDir, "agents", "main", "agent"));
  });

  it("honors JAR4_AGENT_DIR overrides", async () => {
    tempStateDir = await fs.mkdtemp(path.join(os.tmpdir(), "jar4-agent-"));
    const override = path.join(tempStateDir, "agent");
    process.env.JAR4_AGENT_DIR = override;
    delete process.env.PI_CODING_AGENT_DIR;

    const resolved = resolveJar4AgentDir();

    expect(resolved).toBe(path.resolve(override));
  });
});
