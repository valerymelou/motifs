import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { mockReducedMotion } from '../testing/browser-mocks';
import { prefersReducedMotion } from './reduced-motion';

describe('prefersReducedMotion', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('reads the media query and follows its changes', () => {
    const media = mockReducedMotion(false);
    const reduced = TestBed.runInInjectionContext(prefersReducedMotion);

    expect(reduced()).toBe(false);
    media.change(true);
    expect(reduced()).toBe(true);
  });

  it('removes its listener when the app is destroyed', () => {
    const media = mockReducedMotion(false);
    TestBed.runInInjectionContext(prefersReducedMotion);

    expect(media.listenerCount()).toBe(1);
    TestBed.resetTestingModule();
    expect(media.listenerCount()).toBe(0);
  });

  it('assumes reduced motion on the server without touching window', () => {
    vi.stubGlobal('matchMedia', vi.fn());
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const reduced = TestBed.runInInjectionContext(prefersReducedMotion);

    expect(reduced()).toBe(true);
    expect(matchMedia).not.toHaveBeenCalled();
  });
});
