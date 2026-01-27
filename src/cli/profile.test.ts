import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "jar4",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) throw new Error(res.error);
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "jar4", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "jar4", "--dev", "gateway"]);
    if (!res.ok) throw new Error(res.error);
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "jar4", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "jar4", "--profile", "work", "status"]);
    if (!res.ok) throw new Error(res.error);
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "jar4", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "jar4", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it("rejects combining --dev with --profile (dev first)", () => {
    const res = parseCliProfileArgs(["node", "jar4", "--dev", "--profile", "work", "status"]);
    expect(res.ok).toBe(false);
  });

  it("rejects combining --dev with --profile (profile first)", () => {
    const res = parseCliProfileArgs(["node", "jar4", "--profile", "work", "--dev", "status"]);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join("/home/peter", ".jar4-dev");
    expect(env.JAR4_PROFILE).toBe("dev");
    expect(env.JAR4_STATE_DIR).toBe(expectedStateDir);
    expect(env.JAR4_CONFIG_PATH).toBe(path.join(expectedStateDir, "jar4.json"));
    expect(env.JAR4_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      JAR4_STATE_DIR: "/custom",
      JAR4_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.JAR4_STATE_DIR).toBe("/custom");
    expect(env.JAR4_GATEWAY_PORT).toBe("19099");
    expect(env.JAR4_CONFIG_PATH).toBe(path.join("/custom", "jar4.json"));
  });
});

describe("formatCliCommand", () => {
  it("returns command unchanged when no profile is set", () => {
    expect(formatCliCommand("jar4 doctor --fix", {})).toBe("jar4 doctor --fix");
  });

  it("returns command unchanged when profile is default", () => {
    expect(formatCliCommand("jar4 doctor --fix", { JAR4_PROFILE: "default" })).toBe(
      "jar4 doctor --fix",
    );
  });

  it("returns command unchanged when profile is Default (case-insensitive)", () => {
    expect(formatCliCommand("jar4 doctor --fix", { JAR4_PROFILE: "Default" })).toBe(
      "jar4 doctor --fix",
    );
  });

  it("returns command unchanged when profile is invalid", () => {
    expect(formatCliCommand("jar4 doctor --fix", { JAR4_PROFILE: "bad profile" })).toBe(
      "jar4 doctor --fix",
    );
  });

  it("returns command unchanged when --profile is already present", () => {
    expect(
      formatCliCommand("jar4 --profile work doctor --fix", { JAR4_PROFILE: "work" }),
    ).toBe("jar4 --profile work doctor --fix");
  });

  it("returns command unchanged when --dev is already present", () => {
    expect(formatCliCommand("jar4 --dev doctor", { JAR4_PROFILE: "dev" })).toBe(
      "jar4 --dev doctor",
    );
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("jar4 doctor --fix", { JAR4_PROFILE: "work" })).toBe(
      "jar4 --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("jar4 doctor --fix", { JAR4_PROFILE: "  jbclawd  " })).toBe(
      "jar4 --profile jbclawd doctor --fix",
    );
  });

  it("handles command with no args after jar4", () => {
    expect(formatCliCommand("jar4", { JAR4_PROFILE: "test" })).toBe(
      "jar4 --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm jar4 doctor", { JAR4_PROFILE: "work" })).toBe(
      "pnpm jar4 --profile work doctor",
    );
  });
});
