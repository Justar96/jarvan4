import path from "node:path";

import { describe, expect, it } from "vitest";

import { resolveGatewayStateDir } from "./paths.js";

describe("resolveGatewayStateDir", () => {
  it("uses the default state dir when no overrides are set", () => {
    const env = { HOME: "/Users/test" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".jar4"));
  });

  it("appends the profile suffix when set", () => {
    const env = { HOME: "/Users/test", JAR4_PROFILE: "rescue" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".jar4-rescue"));
  });

  it("treats default profiles as the base state dir", () => {
    const env = { HOME: "/Users/test", JAR4_PROFILE: "Default" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".jar4"));
  });

  it("uses JAR4_STATE_DIR when provided", () => {
    const env = { HOME: "/Users/test", JAR4_STATE_DIR: "/var/lib/jar4" };
    expect(resolveGatewayStateDir(env)).toBe(path.resolve("/var/lib/jar4"));
  });

  it("expands ~ in JAR4_STATE_DIR", () => {
    const env = { HOME: "/Users/test", JAR4_STATE_DIR: "~/jar4-state" };
    expect(resolveGatewayStateDir(env)).toBe(path.resolve("/Users/test/jar4-state"));
  });

  it("preserves Windows absolute paths without HOME", () => {
    const env = { JAR4_STATE_DIR: "C:\\State\\jar4" };
    expect(resolveGatewayStateDir(env)).toBe("C:\\State\\jar4");
  });
});
