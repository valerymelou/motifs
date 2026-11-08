import { Component, input } from '@angular/core';

/**
 * A drawn phone, in CSS: modern proportions, a thin even bezel, a camera
 * island, side buttons and a glass highlight, with no real device's name
 * or look-alike logo. The screen is laid out at a real phone's size, 390
 * by 844, and the whole phone is scaled by `--phone-scale` (phone.css), so
 * the app inside is drawn at true scale.
 *
 * Project the screens; each draws its own status bar, as a real app's
 * screens do. The phone is a picture: it is inert and hidden from screen
 * readers, so give the page a caption that says what it shows.
 */
@Component({
  selector: 'mt-phone',
  host: { inert: '', 'aria-hidden': 'true' },
  template: `
    <div class="phone-body" [class.dark]="dark()">
      <span class="phone-button action"></span>
      <span class="phone-button volume-up"></span>
      <span class="phone-button volume-down"></span>
      <span class="phone-button power"></span>
      <div class="phone-screen">
        <ng-content />
        <span class="phone-island"></span>
        <span class="phone-home"></span>
      </div>
    </div>
  `,
})
export class Phone {
  /** Whether the home indicator is drawn light, over a dark screen. */
  readonly dark = input(false);
}

/**
 * A phone's status bar, at true scale: the time, and the signal, Wi-Fi and
 * battery glyphs.
 */
@Component({
  selector: 'mt-status-bar',
  host: { class: 'status-bar', '[class.light]': 'light()' },
  template: `
    <span class="status-time">{{ time() }}</span>
    <span class="status-glyphs">
      <svg viewBox="0 0 18 12" class="signal">
        <rect x="0" y="8" width="3" height="4" rx="1" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
        <rect x="10" y="3" width="3" height="9" rx="1" />
        <rect x="15" y="0" width="3" height="12" rx="1" />
      </svg>
      <svg viewBox="0 0 16 12" class="wifi">
        <path
          d="M8 2.3c2.3 0 4.4.9 6 2.4l1.1-1.2A10.2 10.2 0 0 0 8 .6 10.2 10.2 0 0 0 .9 3.5L2 4.7a8.6 8.6 0 0 1 6-2.4Zm0 3.4c1.4 0 2.6.5 3.6 1.4l1.1-1.2A7 7 0 0 0 8 4a7 7 0 0 0-4.7 1.9l1.1 1.2c1-.9 2.2-1.4 3.6-1.4Zm0 3.4c.6 0 1.1.2 1.5.6L8 11.4 6.5 9.7c.4-.4.9-.6 1.5-.6Z"
        />
      </svg>
      <svg viewBox="0 0 27 13" class="battery">
        <rect
          x="0.5"
          y="0.5"
          width="23"
          height="12"
          rx="3.6"
          class="battery-case"
        />
        <rect x="2" y="2" width="17" height="9" rx="2.2" />
        <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" />
      </svg>
    </span>
  `,
})
export class StatusBar {
  readonly time = input('9:41');
  /** Light glyphs, for a dark screen such as the lock screen. */
  readonly light = input(false);
}

/** The app's four tabs, the active one in the green. Lucide's icons (ISC). */
@Component({
  selector: 'mt-tab-bar',
  host: { class: 'tab-bar' },
  template: `
    @for (tab of tabs(); track tab; let i = $index) {
      <span class="tab" [class.active]="i === active()">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          @switch (i) {
            @case (0) {
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="3" r="2" fill="currentColor" />
            }
            @case (1) {
              <path d="M12 7v14" />
              <path
                d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
              />
            }
            @case (2) {
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            }
            @default {
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            }
          }
        </svg>
        {{ tab }}
      </span>
    }
  `,
})
export class TabBar {
  readonly tabs = input.required<readonly string[]>();
  readonly active = input(0);
}
