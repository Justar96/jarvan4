import { describe, expect, it } from "vitest";

import { Jar4Schema } from "./zod-schema.js";

describe("skills entries config schema", () => {
  it("accepts custom fields under config", () => {
    const res = Jar4Schema.safeParse({
      skills: {
        entries: {
          "custom-skill": {
            enabled: true,
            config: {
              url: "https://example.invalid",
              token: "abc123",
            },
          },
        },
      },
    });

    expect(res.success).toBe(true);
  });

  it("rejects unknown top-level fields", () => {
    const res = Jar4Schema.safeParse({
      skills: {
        entries: {
          "custom-skill": {
            url: "https://example.invalid",
          },
        },
      },
    });

    expect(res.success).toBe(false);
    if (res.success) return;

    expect(
      res.error.issues.some(
        (issue) =>
          issue.path.join(".") === "skills.entries.custom-skill" &&
          issue.message.toLowerCase().includes("unrecognized"),
      ),
    ).toBe(true);
  });
});
