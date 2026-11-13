import { clock } from './roasts-section';

describe('clock', () => {
  it('reads minutes as a roaster’s clock does', () => {
    expect(clock(10.75)).toBe('10:45');
    expect(clock(8.2)).toBe('8:12');
    expect(clock(12)).toBe('12:00');
  });
});
