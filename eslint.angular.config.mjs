import nx from '@nx/eslint-plugin';
import baseConfig from './eslint.config.mjs';

// Shared by every Angular project, so the mt prefix and the spec's MUST
// rules are enforced in one place instead of per app.
export default [
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  ...baseConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'mt',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'mt',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-output-emitter-ref': 'error',
      '@angular-eslint/prefer-host-metadata-property': 'error',
    },
  },
  {
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/no-any': 'error',
    },
  },
];
