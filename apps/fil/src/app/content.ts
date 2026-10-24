/**
 * Fil's copy. Sections read their words from here, never from
 * templates.
 */

/**
 * The fictional API's surface. The domain is on `.example`, reserved for
 * documentation, and the key is a placeholder, so nothing here can be
 * mistaken for a real service or a real secret.
 */
export const API = {
  baseUrl: 'https://api.fil.example/v1',
  testKey: 'fil_test_xxxxxxxxxxxx',
} as const;

export const siteHeader = {
  name: 'Fil',
  place: 'Built in Buea',
  navLabel: 'Sections',
  links: [
    { label: 'Code', href: '#code' },
    { label: 'Coverage', href: '#coverage' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
} as const;

export const hero = {
  title: 'One thread, every network.',
  tagline:
    'Send SMS and WhatsApp messages across Africa with one API, from Buea.',
} as const;

export const code = {
  label: 'Code',
  title: 'Three requests, five languages.',
  lead: "Each sample uses its language's own HTTP tooling, so there is nothing to install. Pick a language once and every sample follows.",
  languages: (title: string) => `${title}: language`,
  copy: 'Copy',
  copied: 'Copied',
  copyLabel: (title: string, language: string) =>
    `Copy the ${language} sample: ${title}`,
  sendTest: 'Send test',
  statuses: { queued: 'Queued', delivered: 'Delivered' },
  testNote: 'Test mode: nothing leaves this page.',
  samples: [
    {
      task: 'send-sms',
      title: 'Send an SMS',
      text: 'One request, with the number in international format. The reply says how many parts the message took.',
      sendable: true,
    },
    {
      task: 'send-whatsapp',
      title: 'Send a WhatsApp template',
      text: "Outside the 24-hour window, WhatsApp only delivers approved templates. Name a fallback and Fil sends an SMS when WhatsApp can't deliver.",
      sendable: true,
    },
    {
      task: 'delivery-receipt',
      title: 'Receive delivery receipts',
      text: 'Fil posts a receipt to your webhook each time a message changes status: queued, sent, delivered, read or failed.',
      sendable: false,
    },
  ],
} as const;

export const palette = {
  open: 'Search',
  label: 'Commands',
  placeholder: 'Type a command or search…',
  empty: 'No command matches.',
  groups: {
    goTo: 'Go to',
    language: 'Code language',
    copy: 'Copy',
    theme: 'Theme',
  },
  goTo: [
    { id: 'code', label: 'Code samples' },
    { id: 'features', label: 'Features' },
    { id: 'coverage', label: 'Coverage' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'changelog', label: 'Changelog' },
    { id: 'faq', label: 'FAQ' },
  ],
  language: (name: string) => `Show samples in ${name}`,
  copyKey: 'Copy the test API key',
  copyUrl: 'Copy the base URL',
  themes: {
    light: 'Use the light theme',
    dark: 'Use the dark theme',
    system: 'Match the system theme',
  },
  announce: {
    copiedKey: 'Copied the test API key.',
    copiedUrl: 'Copied the base URL.',
    language: (name: string) => `Samples now in ${name}.`,
    theme: {
      light: 'Light theme.',
      dark: 'Dark theme.',
      system: 'Theme follows the system.',
    },
  },
  copyFailed: 'Your browser blocked copying. Select the text and copy it:',
  close: 'Close',
} as const;

export const pageFooter = {
  name: 'Fil',
  place: 'Buea, South West Region, Cameroon',
} as const;
