/** Stubs `matchMedia` so the reduced-motion query answers `reduced`. */
export function mockReducedMotion(reduced: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const query = {
    matches: reduced,
    addEventListener: (
      _: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => listeners.add(listener),
    removeEventListener: (
      _: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => listeners.delete(listener),
  };
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => query),
  );
  return {
    change(matches: boolean) {
      query.matches = matches;
      for (const listener of listeners) {
        listener({ matches } as MediaQueryListEvent);
      }
    },
    listenerCount: () => listeners.size,
  };
}

/** An `IntersectionObserver` whose entries the test reports by hand. */
export class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly targets: Element[] = [];
  disconnected = false;

  constructor(private readonly callback: IntersectionObserverCallback) {
    FakeIntersectionObserver.instances.push(this);
  }

  observe(target: Element) {
    this.targets.push(target);
  }

  disconnect() {
    this.disconnected = true;
  }

  /** Reports whether the first observed element is on screen. */
  report(isIntersecting: boolean) {
    const target = this.targets[0];
    if (!target) {
      throw new Error('Nothing is observed.');
    }
    this.callback(
      [{ isIntersecting, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

export function mockIntersectionObserver() {
  FakeIntersectionObserver.instances = [];
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
}

/** Runs animation frames synchronously. */
export function mockAnimationFrames() {
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0);
    return 0;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
}

/** Gives `element` a fixed box, as layout would. */
export function mockBox(element: Element, top: number, height: number) {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    top,
    height,
  } as DOMRect);
}
