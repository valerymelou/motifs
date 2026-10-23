import { isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
  type Signal,
} from '@angular/core';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Holds one media-query listener for the whole app. */
@Injectable({ providedIn: 'root' })
export class ReducedMotionPreference {
  readonly reduced: Signal<boolean> = this.watch();

  private watch(): Signal<boolean> {
    // The server can't know the visitor's setting. Assuming reduced motion
    // keeps prerendered markup in its static, fully readable form.
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      return signal(true).asReadonly();
    }

    const query = matchMedia(REDUCED_MOTION_QUERY);
    const reduced = signal(query.matches);
    const update = (event: MediaQueryListEvent) => reduced.set(event.matches);
    query.addEventListener('change', update);
    inject(DestroyRef).onDestroy(() =>
      query.removeEventListener('change', update),
    );
    return reduced.asReadonly();
  }
}

/**
 * Whether the visitor asked for reduced motion. Updates live when the
 * setting changes. `true` during server rendering. Call it in an
 * injection context.
 */
export function prefersReducedMotion(): Signal<boolean> {
  return inject(ReducedMotionPreference).reduced;
}
