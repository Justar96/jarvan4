import { describe, expect, it } from "vitest";

import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it("detects help/version flags", () => {
    expect(hasHelpOrVersion(["node", "jar4", "--help"])).toBe(true);
    expect(hasHelpOrVersion(["node", "jar4", "-V"])).toBe(true);
    expect(hasHelpOrVersion(["node", "jar4", "status"])).toBe(false);
  });

  it("extracts command path ignoring flags and terminator", () => {
    expect(getCommandPath(["node", "jar4", "status", "--json"], 2)).toEqual(["status"]);
    expect(getCommandPath(["node", "jar4", "agents", "list"], 2)).toEqual(["agents", "list"]);
    expect(getCommandPath(["node", "jar4", "status", "--", "ignored"], 2)).toEqual(["status"]);
  });

  it("returns primary command", () => {
    expect(getPrimaryCommand(["node", "jar4", "agents", "list"])).toBe("agents");
    expect(getPrimaryCommand(["node", "jar4"])).toBeNull();
  });

  it("parses boolean flags and ignores terminator", () => {
    expect(hasFlag(["node", "jar4", "status", "--json"], "--json")).toBe(true);
    expect(hasFlag(["node", "jar4", "--", "--json"], "--json")).toBe(false);
  });

  it("extracts flag values with equals and missing values", () => {
    expect(getFlagValue(["node", "jar4", "status", "--timeout", "5000"], "--timeout")).toBe(
      "5000",
    );
    expect(getFlagValue(["node", "jar4", "status", "--timeout=2500"], "--timeout")).toBe("2500");
    expect(getFlagValue(["node", "jar4", "status", "--timeout"], "--timeout")).toBeNull();
    expect(getFlagValue(["node", "jar4", "status", "--timeout", "--json"], "--timeout")).toBe(
      null,
    );
    expect(getFlagValue(["node", "jar4", "--", "--timeout=99"], "--timeout")).toBeUndefined();
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "jar4", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "jar4", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "jar4", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it("parses positive integer flag values", () => {
    expect(getPositiveIntFlagValue(["node", "jar4", "status"], "--timeout")).toBeUndefined();
    expect(
      getPositiveIntFlagValue(["node", "jar4", "status", "--timeout"], "--timeout"),
    ).toBeNull();
    expect(
      getPositiveIntFlagValue(["node", "jar4", "status", "--timeout", "5000"], "--timeout"),
    ).toBe(5000);
    expect(
      getPositiveIntFlagValue(["node", "jar4", "status", "--timeout", "nope"], "--timeout"),
    ).toBeUndefined();
  });

  it("builds parse argv from raw args", () => {
    const nodeArgv = buildParseArgv({
      programName: "jar4",
      rawArgs: ["node", "jar4", "status"],
    });
    expect(nodeArgv).toEqual(["node", "jar4", "status"]);

    const versionedNodeArgv = buildParseArgv({
      programName: "jar4",
      rawArgs: ["node-22", "jar4", "status"],
    });
    expect(versionedNodeArgv).toEqual(["node-22", "jar4", "status"]);

    const versionedNodeWindowsArgv = buildParseArgv({
      programName: "jar4",
      rawArgs: ["node-22.2.0.exe", "jar4", "status"],
    });
    expect(versionedNodeWindowsArgv).toEqual(["node-22.2.0.exe", "jar4", "status"]);

    const versionedNodePatchlessArgv = buildParseArgv({
      programName: "jar4",
      rawArgs: ["node-22.2", "jar4", "status"],
    });
    expect(versionedNodePatchlessArgv).toEqual(["node-22.2", "jar4", "status"]);

    const versionedNodeWindowsPatchlessArgv = buildParseArgv({
      programName: "jar4",
      rawArgs: ["node-22.2.exe", "jar4", "status"],
    });
    expect(versionedNodeWindowsPatchlessArgv).toEqual(["node-22.2.exe", "jar4", "status"]);

    const versionedNodeWithPathArgv = buildParseArgv({
      programName: "jar4",
      rawArgs: ["/usr/bin/node-22.2.0", "jar4", "status"],
    });
    expect(versionedNodeWithPathArgv).toEqual(["/usr/bin/node-22.2.0", "jar4", "status"]);

    const nodejsArgv = buildParseArgv({
      programName: "jar4",
      rawArgs: ["nodejs", "jar4", "status"],
    });
    expect(nodejsArgv).toEqual(["nodejs", "jar4", "status"]);

    const nonVersionedNodeArgv = buildParseArgv({
      programName: "jar4",
      rawArgs: ["node-dev", "jar4", "status"],
    });
    expect(nonVersionedNodeArgv).toEqual(["node", "jar4", "node-dev", "jar4", "status"]);

    const directArgv = buildParseArgv({
      programName: "jar4",
      rawArgs: ["jar4", "status"],
    });
    expect(directArgv).toEqual(["node", "jar4", "status"]);

    const bunArgv = buildParseArgv({
      programName: "jar4",
      rawArgs: ["bun", "src/entry.ts", "status"],
    });
    expect(bunArgv).toEqual(["bun", "src/entry.ts", "status"]);
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "jar4",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "jar4", "status"]);
  });

  it("decides when to migrate state", () => {
    expect(shouldMigrateState(["node", "jar4", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "jar4", "health"])).toBe(false);
    expect(shouldMigrateState(["node", "jar4", "sessions"])).toBe(false);
    expect(shouldMigrateState(["node", "jar4", "memory", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "jar4", "agent", "--message", "hi"])).toBe(false);
    expect(shouldMigrateState(["node", "jar4", "agents", "list"])).toBe(true);
    expect(shouldMigrateState(["node", "jar4", "message", "send"])).toBe(true);
  });

  it("reuses command path for migrate state decisions", () => {
    expect(shouldMigrateStateFromPath(["status"])).toBe(false);
    expect(shouldMigrateStateFromPath(["agents", "list"])).toBe(true);
  });
});
