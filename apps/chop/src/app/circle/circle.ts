/**
 * A njangi's turns, from its size, its contribution and its first month:
 * every member pays the same amount each month, and each month's pot goes
 * to one member until everyone has had a turn. No interest, no bidding.
 */

/** A circle, as the calculator's controls set it. */
export interface Circle {
  /** How many members, 3 to 20. */
  readonly members: number;
  /** What each member pays a month, in FCFA. */
  readonly contribution: number;
  /** The first turn's month in {@link FIRST_YEAR}, 0 (January) to 11. */
  readonly start: number;
}

/** One member's turn to chop the pot. */
export interface Turn {
  /** The month of the turn, such as "October 2027". */
  readonly month: string;
  /** The member whose turn it is. */
  readonly member: string;
  /** What that member has paid in by their turn, this month's payment included. */
  readonly paidIn: number;
  /** The pot they take: every member's payment for the month. */
  readonly takes: number;
}

export const MIN_MEMBERS = 3;
export const MAX_MEMBERS = 20;
export const MIN_CONTRIBUTION = 5_000;
export const MAX_CONTRIBUTION = 100_000;
export const CONTRIBUTION_STEP = 5_000;
/** The year the calculator's circles start in. */
export const FIRST_YEAR = 2027;

/** The example the page prerenders, and shows without JavaScript. */
export const EXAMPLE: Circle = { members: 10, contribution: 25_000, start: 0 };

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/**
 * The members, in the order the draw gave them. Common first names from
 * around Bamenda and the South West, for fictional people; the first ten
 * are the hero phone's circle.
 */
export const MEMBERS = [
  'Ama',
  'Ngwa',
  'Ebai',
  'Lum',
  'Kum',
  'Bih',
  'Tabe',
  'Fru',
  'Nkeng',
  'Yuh',
  'Ayuk',
  'Enow',
  'Manka',
  'Ndi',
  'Sirri',
  'Tanyi',
  'Akwi',
  'Che',
  'Mbah',
  'Ngum',
] as const;

const grouped = new Intl.NumberFormat('en-US');

/**
 * An amount in FCFA, as the copy writes it.
 *
 * @param amount - Whole francs.
 * @returns The amount with its unit, kept on one line: "250,000 FCFA".
 */
export function fcfa(amount: number): string {
  return `${grouped.format(amount)}\u00a0FCFA`;
}

/**
 * The month `offset` months after the circle's first one.
 *
 * @param start - The first month in {@link FIRST_YEAR}, 0 to 11.
 * @param offset - How many months later.
 * @returns The month and its year, such as "February 2028".
 */
export function monthName(start: number, offset = 0): string {
  const index = start + offset;
  return `${MONTHS[index % 12]} ${FIRST_YEAR + Math.floor(index / 12)}`;
}

/**
 * Every turn of a circle, in order.
 *
 * @param circle - The circle.
 * @returns One turn per member: the first member takes the pot after one
 *   payment, the last after paying in all of it.
 */
export function turns(circle: Circle): readonly Turn[] {
  const takes = circle.contribution * circle.members;
  return MEMBERS.slice(0, circle.members).map((member, i) => ({
    month: monthName(circle.start, i),
    member,
    paidIn: circle.contribution * (i + 1),
    takes,
  }));
}

/**
 * The circle in one sentence, for the live region.
 *
 * @param circle - The circle.
 * @returns For example "10 members at 25,000 FCFA: each takes 250,000 FCFA
 *   once; the last turn is October 2027."
 */
export function summary(circle: Circle): string {
  const pot = fcfa(circle.contribution * circle.members);
  const last = monthName(circle.start, circle.members - 1);
  return `${circle.members} members at ${fcfa(circle.contribution)}: each takes ${pot} once; the last turn is ${last}.`;
}
