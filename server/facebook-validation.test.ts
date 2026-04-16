import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./_core/env', () => ({
  ENV: {
    facebookPageAccessToken: 'test-token',
  },
}));

import { validateFacebookCredentials } from './_core/facebook';

describe('Facebook Credentials Validation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns true when Graph API returns a valid /me response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: '1', name: 'Marjahans Page' }),
      })
    );

    const isValid = await validateFacebookCredentials();
    expect(isValid).toBe(true);
  });

  it('returns false when Graph API responds with an error payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: { message: 'Invalid token' } }),
      })
    );

    const isValid = await validateFacebookCredentials();
    expect(isValid).toBe(false);
  });
});
