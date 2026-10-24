import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { getReadyUrl, workspaceRoot } from '@nx/devkit';

// The page lives under /fil/, as on the deployed site. BASE_URL lets
// CI point the same suite at a preview deployment.
const origin = getReadyUrl('http://localhost:4302');
const baseURL = process.env['BASE_URL'] || new URL('/fil/', origin).href;

export default defineConfig({
  ...nxE2EPreset(import.meta.dirname, { testDir: './src' }),
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  // Serve the prerendered build, not the dev server, so tests see the same
  // static HTML that is deployed.
  webServer: {
    command: 'pnpm exec nx run fil:serve-static',
    url: baseURL,
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
