import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { getReadyUrl, workspaceRoot } from '@nx/devkit';

// BASE_URL lets CI point the same suite at a preview deployment.
const baseURL = process.env['BASE_URL'] || getReadyUrl('http://localhost:4200');

export default defineConfig({
  ...nxE2EPreset(import.meta.dirname, { testDir: './src' }),
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  // Serve the prerendered build, not the dev server, so tests see the same
  // static HTML that is deployed.
  webServer: {
    command: 'pnpm exec nx run motifs:serve-static',
    url: getReadyUrl('http://localhost:4200'),
    reuseExistingServer: true,
    cwd: workspaceRoot,
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // The quality bar is measured on mobile, so every spec runs there too.
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
