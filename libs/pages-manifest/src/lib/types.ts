/** The three families the series groups its pages into. */
export type PageMood = 'immersive' | 'editorial' | 'playful';

/** Whether a page is published or still listed as coming soon. */
export type PageStatus = 'live' | 'soon';

/**
 * Item names from the Ndop UI registry (`ndop list --type ui`), so a typo in
 * a page's list fails type-checking instead of slipping into the index.
 */
export type NdopItem =
  | 'accordion'
  | 'alert'
  | 'alert-dialog'
  | 'aspect-ratio'
  | 'avatar'
  | 'badge'
  | 'breadcrumb'
  | 'button'
  | 'calendar'
  | 'card'
  | 'chart'
  | 'checkbox'
  | 'collapsible'
  | 'combobox'
  | 'command'
  | 'context-menu'
  | 'data-table'
  | 'date-picker'
  | 'dialog'
  | 'drawer'
  | 'dropdown-menu'
  | 'empty'
  | 'form-field'
  | 'hover-card'
  | 'input'
  | 'input-otp'
  | 'label'
  | 'menubar'
  | 'navigation-menu'
  | 'pagination'
  | 'popover'
  | 'progress'
  | 'radio-group'
  | 'resizable'
  | 'scroll-area'
  | 'select'
  | 'separator'
  | 'sheet'
  | 'sidebar'
  | 'skeleton'
  | 'slider'
  | 'spinner'
  | 'switch'
  | 'table'
  | 'tabs'
  | 'textarea'
  | 'toast'
  | 'toggle'
  | 'toggle-group'
  | 'tooltip';

/** One landing page in the series. */
export interface Page {
  /** URL path segment and app folder name: `/<slug>/`, `apps/<slug>`. */
  readonly slug: string;
  readonly name: string;
  /** One line in the brand's voice; also the page's meta description. */
  readonly tagline: string;
  readonly mood: PageMood;
  /** The brand's signature color, as a CSS hex value. */
  readonly accent: `#${string}`;
  readonly status: PageStatus;
  /** Ndop items the page restyles, as planned in its brief. */
  readonly ndopItems: readonly NdopItem[];
}
