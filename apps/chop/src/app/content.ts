/**
 * Chop's copy. Sections read their words from here, never from templates.
 * Facts about njangis come only from the claims checked on the art
 * direction board; their sources are in the app's README.
 */

export const siteHeader = {
  name: 'Chop',
  place: 'Made in Bamenda',
  navLabel: 'Sections',
  links: [
    { label: 'How it works', href: '#how' },
    { label: 'Calculator', href: '#calculator' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
  getApp: { label: 'Get the app', href: '#get-app' },
} as const;

export const hero = {
  label: 'For njangis of 3 to 20',
  title: 'Ten friends. One pot. Every turn comes.',
  tagline:
    'Run your njangi without the notebook: who has paid, whose turn it is, and a reminder before every meeting.',
  calculator: 'Try the calculator',
  getApp: 'Get the app',
} as const;

export const calculator = {
  id: 'calculator',
  label: 'Calculator',
  title: 'See your circle before the first meeting.',
  intro:
    'Choose how many of you there are, what each pays a month and when the first turn falls. Every member takes the same pot once; what changes is how much they have paid in by then.',
  members: 'Members',
  contribution: 'Each pays a month',
  start: 'First turn',
  startYear: 2027,
  caption: 'What each member has paid in by their turn, against the pot',
  hint: 'Use the arrow keys to read each turn.',
  legend: {
    paidIn: 'Paid in by their turn',
    turn: 'This turn',
  },
  pot: 'The pot',
  lastTurn: 'Last turn',
  table: {
    toggle: 'Show as a table',
    caption: 'Each turn of the circle',
    month: 'Month',
    member: 'Member',
    paidIn: 'Paid in by then',
    takes: 'Takes',
  },
  turnOf: (member: string) => `${member}’s turn`,
  paidIn: 'Paid in',
  takes: 'Takes',
  note: 'With no interest, an early turn works like a loan and a late turn like savings.',
} as const;

export const pageFooter = {
  name: 'Chop',
  place: 'Made in Bamenda',
} as const;
