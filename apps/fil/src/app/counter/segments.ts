/**
 * The GSM 03.38 default alphabet's basic table, as published: one septet
 * each. Lowercase ç is not in it (only Ç, at 0x09); sources differ on how
 * phones treat it, so the page makes no claim about it and follows the
 * table.
 */
const BASIC = new Set(
  '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?' +
    '¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà',
);

/** The extension table: each costs two septets, an escape and the character. */
const EXTENSION = new Set('\f^{}\\[~]|€');

export interface Segments {
  readonly encoding: 'gsm' | 'ucs2';
  /** Septets for GSM 7-bit, UTF-16 code units for UCS-2. */
  readonly length: number;
  /** The most one part holds, for the length above. */
  readonly limit: number;
  readonly parts: number;
  /** The first character that forced UCS-2, if one did. */
  readonly switchedBy: string | null;
}

/**
 * How an SMS carrying `text` is sent: GSM 7-bit while every character is in
 * the default alphabet or its extension, UCS-2 as soon as one isn't. One
 * part holds 160 septets or 70 UCS-2 units; split messages hold 153 or 67
 * per part, because each part carries a header.
 */
export function segments(text: string): Segments {
  let septets = 0;
  for (const character of text) {
    if (BASIC.has(character)) {
      septets += 1;
    } else if (EXTENSION.has(character)) {
      septets += 2;
    } else {
      const units = text.length;
      return {
        encoding: 'ucs2',
        length: units,
        limit: units > 70 ? 67 : 70,
        parts: partsOf(units, 70, 67),
        switchedBy: character,
      };
    }
  }
  return {
    encoding: 'gsm',
    length: septets,
    limit: septets > 160 ? 153 : 160,
    parts: partsOf(septets, 160, 153),
    switchedBy: null,
  };
}

function partsOf(length: number, single: number, perPart: number): number {
  if (length === 0) {
    return 0;
  }
  return length <= single ? 1 : Math.ceil(length / perPart);
}
