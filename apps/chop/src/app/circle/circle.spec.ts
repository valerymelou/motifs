import {
  EXAMPLE,
  fcfa,
  MAX_CONTRIBUTION,
  MAX_MEMBERS,
  MEMBERS,
  MIN_CONTRIBUTION,
  MIN_MEMBERS,
  monthName,
  summary,
  turns,
} from './circle';

describe('fcfa', () => {
  it('groups thousands and keeps the unit on the same line', () => {
    expect(fcfa(250_000)).toBe('250,000 FCFA');
    expect(fcfa(5_000)).toBe('5,000 FCFA');
    expect(fcfa(2_000_000)).toBe('2,000,000 FCFA');
  });
});

describe('monthName', () => {
  it('runs past December into the next year', () => {
    expect(monthName(0)).toBe('January 2027');
    expect(monthName(11, 1)).toBe('January 2028');
    expect(monthName(11, 19)).toBe('July 2029');
  });
});

describe('turns', () => {
  it('gives every member one turn, in the order of the draw', () => {
    const all = turns(EXAMPLE);

    expect(all.map((turn) => turn.member)).toEqual(MEMBERS.slice(0, 10));
    expect(all[0].month).toBe('January 2027');
    expect(all[9].month).toBe('October 2027');
  });

  it('pays the first member after one payment and the last after all of them', () => {
    const all = turns(EXAMPLE);

    expect(all[0]).toEqual({
      month: 'January 2027',
      member: 'Ama',
      paidIn: 25_000,
      takes: 250_000,
    });
    expect(all[9].paidIn).toBe(all[9].takes);
    expect(new Set(all.map((turn) => turn.takes))).toEqual(new Set([250_000]));
  });

  it('works at the smallest and largest circles', () => {
    const small = turns({
      members: MIN_MEMBERS,
      contribution: MIN_CONTRIBUTION,
      start: 0,
    });
    const large = turns({
      members: MAX_MEMBERS,
      contribution: MAX_CONTRIBUTION,
      start: 11,
    });

    expect(small).toHaveLength(3);
    expect(small[2].takes).toBe(15_000);
    expect(large).toHaveLength(20);
    expect(large[19]).toEqual({
      month: 'July 2029',
      member: 'Ngum',
      paidIn: 2_000_000,
      takes: 2_000_000,
    });
  });
});

describe('summary', () => {
  it('says what each member takes and when the circle ends', () => {
    expect(summary(EXAMPLE)).toBe(
      '10 members at 25,000 FCFA: each takes 250,000 FCFA once; the last turn is October 2027.',
    );
  });

  it('names the year when the circle runs into the next one', () => {
    expect(summary({ members: 6, contribution: 50_000, start: 9 })).toBe(
      '6 members at 50,000 FCFA: each takes 300,000 FCFA once; the last turn is March 2028.',
    );
  });
});
