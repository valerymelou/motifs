import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NdIcon, type NdopThemeMode } from '@ndop/core';
import {
  CODE_LANGUAGES,
  CodeLanguage,
  languageName,
  type CodeLanguageId,
} from '../code/code-language';
import { API, palette } from '../content';
import { ThemeChoice } from '../theme/theme-choice';
import { Button } from '../ui/button/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupHeading,
  CommandInput,
  CommandInputWrapper,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '../ui/command/command';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog/dialog';

const THEMES: readonly NdopThemeMode[] = ['light', 'dark', 'system'];

// One palette per page today, but ids stay unique if that changes.
let nextId = 0;

/**
 * The page's command palette: Ndop's Command inside Ndop's Dialog, opened
 * by ⌘K or Ctrl+K, or by its button in the header. Ndop binds no shortcut
 * and has no command dialog, so both are put together here.
 */
@Component({
  selector: 'mt-command-palette',
  imports: [
    Button,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandGroupHeading,
    CommandInput,
    CommandInputWrapper,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
    NdIcon,
  ],
  templateUrl: './command-palette.html',
  host: { '(document:keydown)': 'onKeydown($event)' },
})
export class CommandPalette {
  private readonly document = inject(DOCUMENT);
  private readonly language = inject(CodeLanguage);
  private readonly theme = inject(ThemeChoice);
  private readonly trigger =
    viewChild.required<ElementRef<HTMLElement>>('trigger');

  protected readonly copy = palette;
  protected readonly api = API;
  protected readonly languages = CODE_LANGUAGES;
  protected readonly themes = THEMES;
  /** Each theme's own search words, so typing "dark" finds dark first. */
  protected readonly themeKeywords: Record<NdopThemeMode, string> = {
    light: 'theme mode light day',
    dark: 'theme mode dark night',
    system: 'theme mode system auto os',
  };
  protected readonly open = signal(false);
  /**
   * Invisible until the page runs: without JavaScript the anchors navigate.
   * Invisible rather than hidden, so the header keeps its height and
   * nothing shifts when the button appears.
   */
  protected readonly ready = signal(false);
  protected readonly shortcut = signal('Ctrl K');
  /** The sections that exist on the page, read when the palette opens. */
  protected readonly sections = signal<
    readonly (typeof palette.goTo)[number][]
  >([]);
  protected readonly announcement = signal('');
  /** Text the browser refused to copy, shown selected to copy by hand. */
  protected readonly fallback = signal<string | null>(null);
  protected readonly fallbackId = `mt-palette-fallback-${nextId++}`;

  /** What the dialog will give focus back to when it closes. */
  private returnTo: HTMLElement | null = null;

  constructor() {
    afterNextRender(() => {
      this.ready.set(true);
      if (/Mac|iPhone|iPad/.test(navigator.platform)) {
        this.shortcut.set('⌘K');
      }
    });
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) {
      return;
    }
    const target = event.target;
    const typing =
      target instanceof HTMLElement &&
      (target.isContentEditable ||
        ((target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') &&
          !target.hasAttribute('ndCommandInput')));
    if (typing) {
      return;
    }
    event.preventDefault();
    this.setOpen(!this.open());
  }

  protected setOpen(open: boolean): void {
    if (open) {
      // The dialog hands focus back to what was focused when it opened, or
      // to its trigger, the same way Ndop's dialog picks it.
      const active = this.document.activeElement;
      this.returnTo =
        active instanceof HTMLElement && active !== this.document.body
          ? active
          : this.trigger().nativeElement;
      this.sections.set(
        palette.goTo.filter((section) =>
          this.document.getElementById(section.id),
        ),
      );
      this.fallback.set(null);
    }
    this.open.set(open);
  }

  protected goTo(id: string): void {
    const heading = this.document.getElementById(id)?.querySelector('h2');
    this.closeThen(() => {
      if (heading instanceof HTMLElement) {
        heading.setAttribute('tabindex', '-1');
        heading.scrollIntoView({ block: 'start' });
        heading.focus({ preventScroll: true });
      }
    });
  }

  protected showLanguage(id: CodeLanguageId): void {
    this.language.set(id);
    this.announce(palette.announce.language(languageName(id)));
    const samples = this.document.getElementById('code');
    this.closeThen(() => {
      const tab = samples?.querySelector<HTMLElement>(
        '[role="tab"][data-state="active"]',
      );
      if (tab) {
        tab.scrollIntoView({ block: 'center' });
        tab.focus({ preventScroll: true });
      }
    });
  }

  protected setTheme(mode: NdopThemeMode): void {
    this.theme.set(mode);
    this.announce(palette.announce.theme[mode]);
    this.closeThen(() => undefined);
  }

  protected async copyText(text: string, done: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.announce(done);
      this.closeThen(() => undefined);
    } catch {
      // Copying was refused: keep the palette open with the text selected.
      this.fallback.set(text);
    }
  }

  protected selectAll(event: FocusEvent): void {
    if (event.target instanceof HTMLInputElement) {
      event.target.select();
    }
  }

  /**
   * Closes the palette, then runs `next` once the dialog has given focus
   * back, so `next` can move it on without the two racing.
   */
  private closeThen(next: () => void): void {
    const back = this.returnTo;
    if (back) {
      back.addEventListener('focus', () => next(), { once: true });
    }
    this.open.set(false);
  }

  private announce(text: string): void {
    // Cleared first, so the same message twice is announced twice.
    this.announcement.set('');
    queueMicrotask(() => this.announcement.set(text));
  }
}
