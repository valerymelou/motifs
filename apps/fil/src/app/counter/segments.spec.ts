import { segments } from './segments';

describe('segments', () => {
  it('fits 160 GSM 7-bit characters in one part', () => {
    expect(segments('a'.repeat(160))).toMatchObject({
      encoding: 'gsm',
      length: 160,
      parts: 1,
    });
  });

  it('splits at 161 into parts of 153', () => {
    expect(segments('a'.repeat(161))).toMatchObject({ parts: 2, limit: 153 });
    expect(segments('a'.repeat(306))).toMatchObject({ parts: 2 });
    expect(segments('a'.repeat(307))).toMatchObject({ parts: 3 });
  });

  it('keeps é, è, à and ù in GSM 7-bit: "café" costs one part', () => {
    expect(segments('Un café à Buea, très près.')).toMatchObject({
      encoding: 'gsm',
      switchedBy: null,
    });
  });

  it('switches to UCS-2 on one ê, and names it', () => {
    expect(segments('Bonne fête')).toMatchObject({
      encoding: 'ucs2',
      limit: 70,
      parts: 1,
      switchedBy: 'ê',
    });
  });

  it('splits UCS-2 at 71 into parts of 67', () => {
    expect(segments('ê'.repeat(70)).parts).toBe(1);
    expect(segments('ê'.repeat(71))).toMatchObject({ parts: 2, limit: 67 });
  });

  it('counts € as two characters', () => {
    expect(segments('10 €').length).toBe(5);
  });

  it('counts an emoji as two UCS-2 units', () => {
    expect(segments('ok 👍')).toMatchObject({ encoding: 'ucs2', length: 5 });
  });

  it('has no parts when empty', () => {
    expect(segments('')).toMatchObject({ length: 0, parts: 0 });
  });

  it('fits the counter’s sample message in one GSM part', () => {
    expect(
      segments('Votre code Fil est 4821. Il expire dans 10 minutes.'),
    ).toMatchObject({ encoding: 'gsm', parts: 1, length: 51 });
  });
});
