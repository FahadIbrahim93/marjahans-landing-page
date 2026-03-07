import { describe, it, expect, beforeAll } from 'vitest';
import { validateFacebookCredentials } from './_core/facebook';

describe('Facebook Credentials Validation', () => {
  it('should validate Facebook credentials successfully', async () => {
    const isValid = await validateFacebookCredentials();
    expect(isValid).toBe(true);
  });

  it('should have required environment variables set', () => {
    expect(process.env.FACEBOOK_APP_ID).toBeDefined();
    expect(process.env.FACEBOOK_APP_SECRET).toBeDefined();
    expect(process.env.FACEBOOK_PAGE_ID).toBeDefined();
    expect(process.env.FACEBOOK_PAGE_ACCESS_TOKEN).toBeDefined();
  });

  it('should have non-empty credentials', () => {
    expect(process.env.FACEBOOK_APP_ID).not.toBe('');
    expect(process.env.FACEBOOK_APP_SECRET).not.toBe('');
    expect(process.env.FACEBOOK_PAGE_ID).not.toBe('');
    expect(process.env.FACEBOOK_PAGE_ACCESS_TOKEN).not.toBe('');
  });
});
