import { onScrollFrame, scrollProgress } from './scroll-frame';

describe('scrollProgress', () => {
  describe('cover', () => {
    it('is 0 when the top edge enters the bottom of the viewport', () => {
      expect(scrollProgress(800, 400, 800)).toBe(0);
    });

    it('is 1 when the bottom edge leaves the top of the viewport', () => {
      expect(scrollProgress(-400, 400, 800)).toBe(1);
    });

    it('is halfway when the element is centred', () => {
      expect(scrollProgress(200, 400, 800)).toBe(0.5);
    });

    it('stays within 0 and 1', () => {
      expect(scrollProgress(2000, 400, 800)).toBe(0);
      expect(scrollProgress(-2000, 400, 800)).toBe(1);
    });
  });

  describe('contain', () => {
    it('runs while a tall element fills the viewport', () => {
      expect(scrollProgress(0, 1600, 800, 'contain')).toBe(0);
      expect(scrollProgress(-400, 1600, 800, 'contain')).toBe(0.5);
      expect(scrollProgress(-800, 1600, 800, 'contain')).toBe(1);
    });

    it('falls back to cover for elements shorter than the viewport', () => {
      expect(scrollProgress(200, 400, 800, 'contain')).toBe(0.5);
    });
  });
});

describe('onScrollFrame', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('runs on the next frame, on scroll, and stops when asked', () => {
    let pending: FrameRequestCallback | undefined;
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      pending = callback;
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', () => (pending = undefined));
    const callback = vi.fn();

    const stop = onScrollFrame(callback);
    pending?.(0);
    dispatchEvent(new Event('scroll'));
    pending?.(0);
    stop();
    dispatchEvent(new Event('scroll'));

    expect(callback).toHaveBeenCalledTimes(2);
    expect(pending).toBeUndefined();
  });
});
