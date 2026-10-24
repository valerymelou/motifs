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
  label: 'SMS · WhatsApp · 25 countries',
  title: 'One thread, every network.',
  tagline:
    'Send SMS and WhatsApp messages across Africa with one API, from Buea.',
  code: 'See the code',
  pricing: 'Pricing',
  terminalLabel: 'A request to Fil and its reply',
  request: [
    'curl https://api.fil.example/v1/messages \\',
    '  -d to=+2376XXXXXXXX \\',
    '  -d body="Votre code Fil est 4821."',
  ],
  reply: [
    '{ "id": "msg_01", "status": "queued", "parts": 1 }',
    '→ sent',
    '→ delivered',
  ],
} as const;

export const features = {
  label: 'Features',
  title: 'What a message needs, and nothing else.',
  items: [
    {
      title: 'One number format',
      text: 'Every number in international format, as E.164 writes it: a plus, the country code, the number. Spaces are fine.',
    },
    {
      title: 'WhatsApp, then SMS',
      text: "Name a fallback and Fil sends an SMS when WhatsApp can't deliver, with one receipt for both.",
    },
    {
      title: 'Receipts by webhook',
      text: 'Fil posts each change of status to your webhook: queued, sent, delivered, read or failed.',
    },
    {
      title: 'Safe to retry',
      text: 'Send the same Idempotency-Key twice and the message goes once, so a timeout never doubles a code.',
    },
    {
      title: 'Test mode',
      text: 'Messages sent with a fil_test_ key are never delivered, but get receipts like real ones.',
    },
    {
      title: 'Priced per part',
      text: 'An SMS costs one price per part, and the counter below shows how many parts a message takes before you send it.',
    },
  ],
} as const;

export type Region = 'west' | 'central' | 'east' | 'southern' | 'north';

/**
 * The countries Fil reaches, by region. Fil's coverage is fictional; the
 * dialling codes are real, checked against the list of telephone country
 * codes. Operators are not named: a fictional API listing real operators
 * as its routes would read as a claim about real businesses.
 */
export const coverage = {
  label: 'Coverage',
  title: '25 countries, every major network.',
  lead: 'One endpoint for all of them. Numbers go in international format; Fil finds the route.',
  note: "Fil's coverage is fictional. The dialling codes are real.",
  regions: [
    {
      id: 'west',
      name: 'West Africa',
      countries: [
        { name: 'Benin', code: '+229' },
        { name: 'Burkina Faso', code: '+226' },
        { name: "Côte d'Ivoire", code: '+225' },
        { name: 'Ghana', code: '+233' },
        { name: 'Mali', code: '+223' },
        { name: 'Nigeria', code: '+234' },
        { name: 'Senegal', code: '+221' },
        { name: 'Togo', code: '+228' },
      ],
    },
    {
      id: 'central',
      name: 'Central Africa',
      countries: [
        { name: 'Cameroon', code: '+237' },
        { name: 'Chad', code: '+235' },
        { name: 'Congo', code: '+242' },
        { name: 'DR Congo', code: '+243' },
        { name: 'Gabon', code: '+241' },
      ],
    },
    {
      id: 'east',
      name: 'East Africa',
      countries: [
        { name: 'Ethiopia', code: '+251' },
        { name: 'Kenya', code: '+254' },
        { name: 'Rwanda', code: '+250' },
        { name: 'Tanzania', code: '+255' },
        { name: 'Uganda', code: '+256' },
        { name: 'Zambia', code: '+260' },
      ],
    },
    {
      id: 'southern',
      name: 'Southern Africa',
      countries: [
        { name: 'Botswana', code: '+267' },
        { name: 'Namibia', code: '+264' },
        { name: 'South Africa', code: '+27' },
      ],
    },
    {
      id: 'north',
      name: 'North Africa',
      countries: [
        { name: 'Egypt', code: '+20' },
        { name: 'Morocco', code: '+212' },
        { name: 'Tunisia', code: '+216' },
      ],
    },
  ],
} as const;

export type Volume = 'start' | 'grow' | 'scale';
export type MessageType =
  | 'sms'
  | 'marketing'
  | 'utility'
  | 'authentication'
  | 'service';

/** Fictional prices, in US dollars per message, at the starting volume. */
const BASE_PRICES: Readonly<
  Record<MessageType, Readonly<Record<Region, number>>>
> = {
  sms: {
    west: 0.021,
    central: 0.034,
    east: 0.024,
    southern: 0.019,
    north: 0.045,
  },
  marketing: {
    west: 0.031,
    central: 0.038,
    east: 0.029,
    southern: 0.033,
    north: 0.042,
  },
  utility: {
    west: 0.008,
    central: 0.009,
    east: 0.007,
    southern: 0.008,
    north: 0.011,
  },
  authentication: {
    west: 0.007,
    central: 0.008,
    east: 0.006,
    southern: 0.007,
    north: 0.01,
  },
  service: {
    west: 0.004,
    central: 0.004,
    east: 0.003,
    southern: 0.004,
    north: 0.005,
  },
};

export const pricing = {
  label: 'Pricing',
  title: 'Per message, by region.',
  note: 'Prices are fictional: Fil is a design study.',
  volumeLabel: 'Monthly volume',
  volumes: [
    { id: 'start', name: 'Up to 10,000', factor: 1 },
    { id: 'grow', name: 'Up to 100,000', factor: 0.85 },
    { id: 'scale', name: 'Over 100,000', factor: 0.7 },
  ],
  caption: (volume: string) =>
    `Price per message in US dollars, at ${volume.toLowerCase()} messages a month`,
  typeHeading: 'Message',
  types: [
    { id: 'sms', name: 'SMS, per part' },
    { id: 'marketing', name: 'WhatsApp marketing' },
    { id: 'utility', name: 'WhatsApp utility' },
    { id: 'authentication', name: 'WhatsApp authentication' },
    { id: 'service', name: 'WhatsApp service' },
  ],
  serviceNote:
    'Each WhatsApp business number gets 1,000 service messages a month free; the price above applies beyond them.',
  regionNames: {
    west: 'West',
    central: 'Central',
    east: 'East',
    southern: 'Southern',
    north: 'North',
  },
  price: (type: MessageType, region: Region, factor: number) =>
    BASE_PRICES[type][region] * factor,
  format: (dollars: number) => `$${dollars.toFixed(4)}`,
} as const;

export const counter = {
  title: 'What will my SMS cost?',
  lead: 'Type a message to see how many parts it takes, and what it costs at the volume above.',
  label: 'Your message',
  regionLabel: 'Sent to',
  terms: {
    encoding: 'Encoding',
    length: 'Length',
    parts: 'Parts',
    cost: 'Cost',
  },
  sample: 'Votre code Fil est 4821. Il expire dans 10 minutes.',
  gsm: 'GSM 7-bit',
  ucs2: 'UCS-2',
  switched: (character: string) =>
    `${character} switches this message to UCS-2.`,
  characters: (used: number, limit: number) => `${used} / ${limit} characters`,
  parts: (count: number) => (count === 1 ? '1 part' : `${count} parts`),
  cost: (parts: number, each: string, total: string) =>
    `${parts} × ${each} = ${total}`,
  empty: 'Type a message to count it.',
  announce: (encoding: string, parts: string, total: string) =>
    `${encoding}, ${parts}, ${total}.`,
} as const;

export const changelog = {
  label: 'Changelog',
  title: 'What changed.',
  entries: [
    {
      date: '2026-10-14',
      shown: '14 October 2026',
      kind: 'New',
      text: 'SMS fallback for WhatsApp templates: name "fallback": "sms" and Fil sends an SMS when WhatsApp can\'t deliver.',
    },
    {
      date: '2026-09-30',
      shown: '30 September 2026',
      kind: 'Improved',
      text: 'Delivery receipts say how many parts an SMS took.',
    },
    {
      date: '2026-09-02',
      shown: '2 September 2026',
      kind: 'New',
      text: 'Test keys: messages sent with a fil_test_ key are never delivered, but get receipts like real ones.',
    },
    {
      date: '2026-08-12',
      shown: '12 August 2026',
      kind: 'Fixed',
      text: 'Numbers written with spaces, such as +237 6XX XX XX XX, no longer fail validation.',
    },
    {
      date: '2025-07-01',
      shown: '1 July 2025',
      kind: 'Improved',
      text: 'WhatsApp prices are per message, as Meta charges since 1 July 2025.',
    },
  ],
} as const;

export const faq = {
  label: 'FAQ',
  title: 'Questions developers ask.',
  items: [
    {
      id: 'window',
      question: "When can I send WhatsApp messages that aren't templates?",
      answer:
        "Within 24 hours of the customer's last message to you. Outside that window, WhatsApp only delivers templates it has approved. Name a fallback and Fil sends an SMS instead.",
    },
    {
      id: 'length',
      question: 'How long can an SMS be?',
      answer:
        '160 characters in the GSM 7-bit alphabet, or 70 in UCS-2. Longer messages are split into parts, and each part carries a header, which leaves 153 or 67 characters per part. Fil charges per part.',
    },
    {
      id: 'accents',
      question: 'Why did my French message cost two SMS?',
      answer:
        'One character outside the GSM 7-bit alphabet, such as ê, â, ô, î, û, ë, ï or œ, sends the whole message as UCS-2, which fits 70 characters instead of 160. é, è, à and ù are in the alphabet, so "café" costs one SMS and "fête" can cost two. The counter in Pricing names the character that switched it.',
    },
    {
      id: 'numbers',
      question: 'What number format does Fil take?',
      answer:
        'International format, as E.164 writes it: a plus, the country code and the number. A Cameroonian mobile is +237 followed by nine digits starting with 6. Spaces are fine.',
    },
    {
      id: 'test',
      question: 'Can I try Fil without sending real messages?',
      answer:
        'Use a test key, which starts with fil_test_. Test messages are never delivered, but get receipts like real ones.',
    },
    {
      id: 'real',
      question: 'Are these prices real?',
      answer:
        'No. Fil is a fictional brand, a design study in the Motifs series: its prices, coverage and changelog are made up for this page.',
    },
  ],
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
