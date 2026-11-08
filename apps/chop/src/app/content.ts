/**
 * Chop's copy. Sections read their words from here, never from templates.
 * Facts about njangis come only from the claims checked on the art
 * direction board; their sources are in the app's README.
 *
 * The page runs through one njangi year, Mami Ama’s circle of ten in 2027
 * (docs/plans/chop.md): each section is a part of that year.
 */

/** The page's seven sections, in order: the header's dial and its menu. */
export const sections = [
  { id: 'year', label: 'The year', note: 'January to October' },
  { id: 'circle', label: 'Your circle', note: 'Calculator' },
  { id: 'month', label: 'A month in Chop', note: 'Features' },
  { id: 'book', label: 'The book', note: 'Trust' },
  { id: 'dues', label: 'Dues', note: 'Pricing' },
  { id: 'questions', label: 'Questions', note: 'FAQ' },
  { id: 'full-circle', label: 'Full circle', note: 'Get the app' },
] as const;

export const siteHeader = {
  name: 'Chop',
  home: '#year',
  menu: 'Sections',
  circle: 'Mami Ama’s circle',
  year: '2027',
  close: 'Close',
} as const;

export interface YearCard {
  /** The card's month, 0 for January. */
  month: number;
  tag: string;
  title: string;
  text: string;
}

export const year = {
  id: 'year',
  label: 'The year',
  pointer: 'This month',
  months: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  pot: {
    label: 'The pot this month',
    amount: '250,000 FCFA',
    note: '10 members, 25,000 FCFA each',
  },
  /** January's card is the page's headline, its h1. */
  cards: [
    {
      month: 0,
      tag: 'January · Ama chops',
      title: 'Ten friends. One pot. Every turn comes.',
      text: 'Run your njangi without the notebook: who has paid, whose turn it is, and a reminder before every meeting.',
    },
    {
      month: 1,
      tag: 'February · Ngwa chops',
      title: 'Agree the amount.',
      text: 'Every member pays the same at each meeting: 25,000 FCFA a month, say.',
    },
    {
      month: 2,
      tag: 'March · Ebai chops',
      title: 'Draw the order.',
      text: 'Turns are agreed before the first payment, often by drawing. Members can swap by agreement before money changes hands.',
    },
    {
      month: 3,
      tag: 'April · Lum chops',
      title: 'Play every month.',
      text: 'Paying in is “playing” njangi. Everyone plays at every meeting, whoever’s turn it is.',
    },
    {
      month: 4,
      tag: 'May · Kum chops',
      title: 'Chop the pot.',
      text: 'Each meeting’s money goes to one member, who “chops” it, until everyone has had a turn.',
    },
    {
      month: 9,
      tag: 'October · Yuh chops, the last turn',
      title: 'Everyone has had the pot once.',
      text: 'Ten turns of 250,000 FCFA. Now see your own circle.',
    },
  ] as readonly YearCard[],
  calculator: { label: 'Try the calculator', href: '#circle' },
  getApp: { label: 'Get the app', href: '#full-circle' },
} as const;

export const calculator = {
  id: 'circle',
  label: 'Your circle',
  title: 'See your circle before the first meeting.',
  intro:
    'Each wedge is one member’s turn: how much they have paid in by then, against the pot round the rim. Every member takes the same pot once.',
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

export const month = {
  id: 'month',
  label: 'A month in Chop',
  title: 'From one meeting to the next.',
  pointer: 'Today',
  /** The four weeks from the March meeting to the April one. */
  length: 28,
  /** What the drawn phone shows, for screen readers: the screen is inert. */
  phoneLabel:
    'The Chop app through four weeks of Mami Ama’s circle, from the March meeting to the April one.',
  days: [
    {
      day: 0,
      mark: 'Meeting',
      when: 'Sunday 7 March, the meeting',
      title: 'The treasurer’s book, kept for you.',
      text: 'Every payment and every turn, month by month, to read out at the meeting.',
    },
    {
      day: 9,
      mark: '16',
      when: 'Tuesday 16 March',
      title: 'Swaps, agreed.',
      text: 'Two members agree to swap turns, the treasurer approves, and the order changes for everyone.',
    },
    {
      day: 13,
      mark: '20',
      when: 'Saturday 20 March',
      title: 'Gifts for life’s big days.',
      text: 'What the group gives at a member’s wedding, a birth, a baptism or a funeral, recorded apart from the pot.',
    },
    {
      day: 27,
      mark: '3',
      when: 'Saturday 3 April',
      title: 'A reminder before every meeting.',
      text: 'Each member gets a message the day before: what they owe, and whose turn it is.',
    },
    {
      day: 28,
      mark: '',
      when: 'Sunday 4 April, the next meeting',
      title: 'Who has paid, at a glance.',
      text: 'Members mark their payment and the treasurer confirms it. No more “paid? ask!”.',
    },
  ],
  /** The app's own words, on its drawn screens. */
  app: {
    circle: 'Mami Ama’s circle',
    tabs: ['Circle', 'Book', 'Members', 'You'],
    book: {
      title: 'Book',
      month: 'March 2027',
      took: 'Ebai took the pot',
      pot: '250,000 FCFA',
      when: 'Sun 7 Mar · confirmed by Ama',
      recorded: 'Recorded',
      payments: 'Payments',
      paid: '10 of 10 paid',
      rows: [
        { name: 'Ama', amount: '25,000' },
        { name: 'Ngwa', amount: '25,000' },
        { name: 'Ebai', amount: '25,000' },
        { name: 'Lum', amount: '25,000' },
        { name: 'Kum', amount: '25,000' },
      ],
      more: '5 more',
    },
    swap: {
      title: 'Members',
      request: 'Swap request',
      waiting: 'Needs you',
      who: 'Bih and Tabe',
      what: 'Bih takes July, Tabe takes June',
      agreed: 'Both agreed on Tue 16 Mar',
      approve: 'Approve',
      decline: 'Decline',
      order: 'Order',
      rows: [
        { month: 'May', name: 'Kum' },
        { month: 'Jun', name: 'Bih', swap: 'Tabe' },
        { month: 'Jul', name: 'Tabe', swap: 'Bih' },
        { month: 'Aug', name: 'Fru' },
      ] as readonly { month: string; name: string; swap?: string }[],
    },
    gift: {
      title: 'Gifts',
      event: 'Fru’s wedding',
      when: 'Sat 20 Mar',
      each: '5,000 FCFA each, apart from the pot',
      given: '7 of 10 given',
      total: '35,000 FCFA',
      give: 'Mark mine as given',
    },
    reminder: {
      time: '18:00',
      date: 'Saturday 3 April',
      app: 'Chop',
      now: 'now',
      title: 'Meeting tomorrow, 4 pm',
      text: 'You pay 25,000 FCFA. It’s Lum’s turn to chop.',
    },
    meeting: {
      title: 'April meeting',
      when: 'Sun 4 Apr · 4 pm · at Ama’s',
      paid: 'Paid',
      count: '9 of 10',
      amount: '240,000 of 250,000 FCFA',
      owes: 'Kum owes 10,000 FCFA',
      remind: 'Remind',
      takes: 'Lum takes the pot',
      pot: '250,000 FCFA',
      confirm: 'Confirm payments',
    },
  },
} as const;

export const book = {
  id: 'book',
  label: 'The book',
  title: 'Chop keeps the book, never the money.',
  intro:
    'You pay each other as you always have, at the meeting or by mobile money. Chop only records it.',
  notebook: {
    label: 'The treasurer’s notebook for March, and what Chop records instead',
    month: 'March',
    rows: [
      { name: 'Ama', mark: '✓ 25 000', status: 'Paid', tone: 'paid' },
      { name: 'Ngwa', mark: '✓ (Lum?)', status: 'Paid', tone: 'paid' },
      {
        name: 'Ebai',
        mark: 'chops Sun.',
        status: 'Takes the pot',
        tone: 'turn',
      },
      { name: 'Lum', mark: 'paid? ask!', status: 'Paid', tone: 'paid' },
      {
        name: 'Kum',
        mark: 'owes 10 000 ??',
        status: 'Owes 10,000 FCFA',
        tone: 'owes',
      },
    ],
  },
  rulesLabel: 'The rules of the book',
  rules: [
    {
      title: 'No money passes through Chop.',
      text: 'It never holds, moves or lends your savings, so there is nothing in it to lose.',
    },
    {
      title: 'Your circle’s book is your circle’s.',
      text: 'Only members see who paid and whose turn it is. Chop shows no one else.',
    },
    {
      title: 'The same pot for everyone.',
      text: 'No interest and no bidding for turns: every member takes the same pot once.',
    },
    {
      title: 'Leave with your book.',
      text: 'A circle can stop using Chop at any time and keep its record of every month.',
    },
  ],
} as const;

export type Period = 'monthly' | 'yearly';

export const pricing = {
  id: 'dues',
  label: 'Dues',
  title: 'Free for your circle.',
  note: 'Prices are fictional: Chop is a design study.',
  periodLabel: 'Billing period',
  periods: [
    { id: 'monthly', name: 'Monthly' },
    { id: 'yearly', name: 'Yearly' },
  ] as readonly { id: Period; name: string }[],
  plans: [
    {
      id: 'circle',
      name: 'Circle',
      text: 'One circle, up to 20 members.',
      price: { monthly: 0, yearly: 0 },
      features: [
        'Reminders before every meeting',
        'The draw and swaps',
        'Who has paid, every month',
      ],
      action: 'Start a circle',
    },
    {
      id: 'treasurer',
      name: 'Treasurer',
      text: 'For treasurers who run several circles.',
      price: { monthly: 1_500, yearly: 15_000 },
      features: [
        'Everything in Circle',
        'Up to ten circles',
        'Gifts for life’s big days',
        'The treasurer’s book for every circle',
      ],
      action: 'Become a treasurer',
    },
  ],
  free: 'Free',
  per: { monthly: 'a month', yearly: 'a year' },
  saving: 'Two months free',
} as const;

export const faq = {
  id: 'questions',
  label: 'Questions',
  title: 'Questions from the meeting.',
  asks: (member: string) => `${member} asks`,
  items: [
    {
      id: 'what',
      askedBy: 'Kum',
      question: 'What is a njangi?',
      answer:
        'A rotating savings circle. Members pay the same amount at each meeting, and each meeting’s money goes to one member, until every member has had a turn. English-speaking Cameroonians call it njangi; French-speaking Cameroonians call it a tontine.',
    },
    {
      id: 'order',
      askedBy: 'Bih',
      question: 'Who goes first?',
      answer:
        'You agree the order before the first payment, often by drawing. Chop runs the draw at your first meeting, and members can swap turns by agreement before money changes hands.',
    },
    {
      id: 'early',
      askedBy: 'Lum',
      question: 'Is an early turn better?',
      answer:
        'With no interest, an early turn works like a loan and a late one like savings: the first member takes the whole pot after one payment, the last after paying in all of it. The calculator shows it for your circle.',
    },
    {
      id: 'money',
      askedBy: 'Tabe',
      question: 'Does Chop hold our money?',
      answer:
        'No. You pay each other as you always have. Chop keeps the book: who has paid, whose turn it is, and what is still owed.',
    },
    {
      id: 'gifts',
      askedBy: 'Fru',
      question: 'Can we give for a member’s wedding or a new baby?',
      answer:
        'Yes. Many groups also give at members’ weddings, births, baptisms and funerals. Chop records those gifts apart from the pot, so the turns stay even.',
    },
    {
      id: 'real',
      askedBy: 'Yuh',
      question: 'Is Chop a real app?',
      answer:
        'No. Chop is a design study, one page of a series: there is no app to download, and its prices are fictional.',
    },
  ],
} as const;

export const fullCircle = {
  id: 'full-circle',
  tag: 'December · full circle',
  title: 'Start the next circle on Chop.',
  text: 'Chop is a design study: there’s no app to download.',
  place: 'Made in Bamenda',
  stores: [
    { id: 'iphone', label: 'iPhone' },
    { id: 'android', label: 'Android' },
  ],
} as const;
