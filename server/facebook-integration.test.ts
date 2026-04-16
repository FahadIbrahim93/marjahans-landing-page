import { describe, expect, it, vi } from "vitest";

vi.mock("./_core/env", () => ({
  ENV: {
    facebookPageAccessToken: "test-token",
  },
}));

import { validateFacebookCredentials } from "./_core/facebook";

describe("Facebook Integration", () => {
  it("validates credentials against the Facebook /me endpoint", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: "page_1", name: "Marjahans Official" }),
      })
    );

    const isValid = await validateFacebookCredentials();
    expect(isValid).toBe(true);
  });
});
