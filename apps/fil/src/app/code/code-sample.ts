import { Component, computed, inject, input, signal } from '@angular/core';
import { NdIcon } from '@ndop/core';
import { code } from '../content';
import { Badge } from '../ui/badge/badge';
import { Button } from '../ui/button/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '../ui/tooltip/tooltip';
import {
  CODE_LANGUAGES,
  CodeLanguage,
  languageName,
  type CodeLanguageId,
} from './code-language';
import { SAMPLES, type Line } from './samples.generated';

type Status = 'idle' | 'queued' | 'delivered';

/**
 * One task in every language, as tabs that follow the page's one language
 * choice, with a copy button and, for sending tasks, a test send.
 */
@Component({
  selector: 'mt-code-sample',
  imports: [
    Badge,
    Button,
    NdIcon,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipTrigger,
  ],
  templateUrl: './code-sample.html',
  host: { class: 'block' },
})
export class CodeSample {
  /** The sample's file name in `samples/`, without its extension. */
  readonly task = input.required<string>();
  readonly title = input.required<string>();
  /** Whether the task sends a message, so it can be sent in test mode. */
  readonly sendable = input(false);

  protected readonly copy = code;
  protected readonly languages = CODE_LANGUAGES;
  protected readonly language = inject(CodeLanguage);
  protected readonly copied = signal(false);
  protected readonly status = signal<Status>('idle');

  private readonly lines = computed(() => SAMPLES[this.task()] ?? {});

  protected linesOf(id: CodeLanguageId): readonly Line[] {
    return this.lines()[id] ?? [];
  }

  protected choose(value: string | null): void {
    const id = CODE_LANGUAGES.find((language) => language.id === value)?.id;
    if (id) {
      this.language.set(id);
    }
  }

  protected copyLabel(): string {
    return this.copy.copyLabel(
      this.title(),
      languageName(this.language.current()),
    );
  }

  protected async copyCode(): Promise<void> {
    const text = this.linesOf(this.language.current())
      .map((line) =>
        line
          .map((token) => (typeof token === 'string' ? token : token[1]))
          .join(''),
      )
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Copying was refused; the code stays on the page to select by hand.
    }
  }

  /** A test send: nothing leaves the page, the receipt arrives on its own. */
  protected sendTest(): void {
    this.status.set('queued');
    setTimeout(() => this.status.set('delivered'), 900);
  }

  protected isPlain(token: Line[number]): token is string {
    return typeof token === 'string';
  }
}
