import { inject, Injectable } from '@angular/core';
import { NdopTheme, type NdopThemeMode } from '@ndop/core';
import { readStored, writeStored } from '../lib/storage';

/** Where the visitor's theme is remembered; index.html reads it too. */
export const THEME_KEY = 'fil:theme';

const MODES: readonly NdopThemeMode[] = ['light', 'dark', 'system'];

/**
 * The visitor's theme: Ndop's light, dark or system mode, remembered for the
 * next visit. A script in index.html applies the remembered one before the
 * first paint; {@link restore} hands it to Ndop once the app starts.
 */
@Injectable({ providedIn: 'root' })
export class ThemeChoice {
  private readonly theme = inject(NdopTheme);
  readonly mode = this.theme.mode;

  set(mode: NdopThemeMode): void {
    this.theme.set(mode);
    writeStored(THEME_KEY, mode);
  }

  /** Applies the remembered theme, if any. Call it in the browser only. */
  restore(): void {
    const saved = MODES.find((mode) => mode === readStored(THEME_KEY));
    if (saved) {
      this.theme.set(saved);
    }
  }
}
