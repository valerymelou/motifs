import { Component, computed, signal } from '@angular/core';
import { ORDER_ADDRESS, patternMaker } from '../../content';
import { Cloth } from '../../pattern/cloth';
import { OrderDialog } from './order-dialog';
import { MOTIFS, type MotifKind } from '../../pattern/motifs';
import {
  DEFAULT_PATTERN,
  DENSITY,
  DEPTHS,
  depthOf,
  describe,
  type IndigoDepth,
  type Pattern,
} from '../../pattern/pattern';
import { Button } from '../../ui/button/button';
import { Label } from '../../ui/label/label';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '../../ui/popover/popover';
import {
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from '../../ui/slider/slider';
import { Switch, SwitchThumb } from '../../ui/switch/switch';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '../../ui/toggle-group/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '../../ui/tooltip/tooltip';

// One pattern maker per page today, but ids stay unique if that changes.
let nextId = 0;

/**
 * The page's signature moment: a cloth the visitor designs row by row, drawn
 * live from the pattern model, then ordered as a scarf.
 */
@Component({
  selector: 'mt-pattern-maker-section',
  imports: [
    Button,
    Cloth,
    Label,
    OrderDialog,
    Popover,
    PopoverContent,
    PopoverPortal,
    PopoverTrigger,
    Slider,
    SliderRange,
    SliderThumb,
    SliderTrack,
    Switch,
    SwitchThumb,
    ToggleGroup,
    ToggleGroupItem,
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipTrigger,
  ],
  templateUrl: './pattern-maker-section.html',
})
export class PatternMakerSection {
  protected readonly copy = patternMaker;
  protected readonly motifs = MOTIFS;
  protected readonly depths = DEPTHS;
  protected readonly density = DENSITY;
  protected readonly dyeId = `mt-pattern-dye-${nextId++}`;

  /**
   * Each row's pressed value, as its toggle group reads it. A row always
   * keeps one motif: pressing the pressed button again re-presses it.
   */
  protected readonly rowValues = signal<readonly (readonly MotifKind[])[]>(
    DEFAULT_PATTERN.rows.map((kind) => [kind]),
  );
  protected readonly depthValue = signal<readonly IndigoDepth[]>([
    DEFAULT_PATTERN.depth,
  ]);
  protected readonly motifsPerRow = signal(DEFAULT_PATTERN.density);
  protected readonly dyed = signal(DEFAULT_PATTERN.dyed);

  private readonly rows = computed(() =>
    this.rowValues().map(
      (value, i) => value[0] ?? DEFAULT_PATTERN.rows[i] ?? 'lozenge',
    ),
  );
  private readonly depth = computed(
    () => this.depthValue()[0] ?? DEFAULT_PATTERN.depth,
  );

  protected readonly pattern = computed<Pattern>(() => ({
    rows: this.rows(),
    density: this.motifsPerRow(),
    depth: this.depth(),
    dyed: this.dyed(),
  }));
  protected readonly description = computed(() => describe(this.pattern()));
  /** Each row's motif, with its name and meaning. */
  protected readonly chosen = computed(() =>
    this.rows().map((kind) => MOTIFS.find((option) => option.kind === kind)),
  );
  protected readonly currentDepth = computed(() => depthOf(this.depth()));

  protected readonly orderLink = computed(() => {
    const pattern = this.pattern();
    const code = `${pattern.rows.join(',')}/${pattern.density}/${pattern.depth}`;
    const params = new URLSearchParams({
      subject: this.copy.dialog.subject,
      body: this.copy.dialog.body(describe({ ...pattern, dyed: true }), code),
    });
    // URLSearchParams encodes spaces as "+", which mail apps show as is.
    return `mailto:${ORDER_ADDRESS}?${params.toString().replace(/\+/g, '%20')}`;
  });

  protected setRow(row: number, value: readonly string[]): void {
    const kind =
      MOTIFS.find((candidate) => candidate.kind === value[0])?.kind ??
      this.rows()[row];
    if (kind) {
      this.rowValues.update((rows) =>
        rows.map((current, i) => (i === row ? [kind] : current)),
      );
    }
  }

  protected setDepth(value: readonly string[]): void {
    const depth =
      DEPTHS.find((candidate) => candidate.depth === value[0])?.depth ??
      this.depth();
    this.depthValue.set([depth]);
  }
}
