import { afterNextRender, Injectable, signal } from '@angular/core';
import { readStored, writeStored } from '../lib/storage';

/** The languages every sample is written in, in the order the tabs show. */
export const CODE_LANGUAGES = [
  { id: 'curl', name: 'curl' },
  { id: 'node', name: 'Node' },
  { id: 'python', name: 'Python' },
  { id: 'php', name: 'PHP' },
  { id: 'go', name: 'Go' },
] as const;

export type CodeLanguageId = (typeof CODE_LANGUAGES)[number]['id'];

const KEY = 'fil:code-language';

/** The language name for an id, such as "Python" for `python`. */
export function languageName(id: CodeLanguageId): string {
  return CODE_LANGUAGES.find((language) => language.id === id)?.name ?? id;
}

/**
 * The one language every code sample shows. Picking it in any sample, or
 * in the command palette, switches them all, and it's remembered for the
 * next visit.
 */
@Injectable({ providedIn: 'root' })
export class CodeLanguage {
  private readonly selected = signal<CodeLanguageId>('curl');
  readonly current = this.selected.asReadonly();

  constructor() {
    // After the first render, so hydration meets the prerendered curl tabs
    // before a remembered language replaces them.
    afterNextRender(() => {
      const saved = CODE_LANGUAGES.find(
        (language) => language.id === readStored(KEY),
      );
      if (saved) {
        this.selected.set(saved.id);
      }
    });
  }

  set(id: CodeLanguageId): void {
    this.selected.set(id);
    writeStored(KEY, id);
  }
}
