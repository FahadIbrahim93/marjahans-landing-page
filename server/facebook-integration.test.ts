import { describe, it, expect } from "vitest";
import { validateFacebookCredentials } from "./_core/facebook";

describe("Facebook Integration", () => {
  it("should validate Facebook credentials", async () => {
    const isValid = await validateFacebookCredentials();
    expect(isValid).toBe(true);
  });
});
