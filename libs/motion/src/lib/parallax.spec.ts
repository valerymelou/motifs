import { Component, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  mockAnimationFrames,
  mockBox,
  mockReducedMotion,
} from '../testing/browser-mocks';
import { Parallax } from './parallax';

@Component({
  imports: [Parallax],
  template: `<div mtParallax="0.5">Layer</div>`,
})
class Host {}

function create() {
  const fixture = TestBed.createComponent(Host);
  const element: HTMLElement = fixture.nativeElement.querySelector('div');
  return { fixture, element };
}

describe('Parallax', () => {
  beforeEach(() => {
    mockAnimationFrames();
    vi.stubGlobal('innerHeight', 800);
  });
  afterEach(() => vi.unstubAllGlobals());

  describe('without scroll-driven animations', () => {
    it('offsets the element by its progress through the viewport', async () => {
      mockReducedMotion(false);
      const { fixture, element } = create();
      // Entering at the bottom: half of 0.5 × 800 px above its place.
      mockBox(element, 800, 200);
      await fixture.whenStable();

      expect(element.style.transform).toBe('translateY(-200px)');
    });

    it('stops listening and clears the offset when destroyed', async () => {
      mockReducedMotion(false);
      const { fixture, element } = create();
      mockBox(element, 800, 200);
      await fixture.whenStable();

      const remove = vi.spyOn(window, 'removeEventListener');
      fixture.destroy();

      expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
  });

  describe('with scroll-driven animations', () => {
    it('attaches a view-timeline animation and cancels it on destroy', async () => {
      mockReducedMotion(false);
      const timelines: unknown[] = [];
      vi.stubGlobal(
        'ViewTimeline',
        class {
          constructor(options: ViewTimelineOptions) {
            timelines.push(options);
          }
        },
      );
      const { fixture, element } = create();
      const animation = { cancel: vi.fn() };
      const animate = vi.fn(() => animation);
      element.animate = animate as unknown as typeof element.animate;
      await fixture.whenStable();

      expect(timelines).toEqual([{ subject: element }]);
      expect(animate).toHaveBeenCalledWith(
        [
          { transform: 'translateY(calc(-1 * 25vh))' },
          { transform: 'translateY(25vh)' },
        ],
        expect.objectContaining({ fill: 'both' }),
      );
      fixture.destroy();
      expect(animation.cancel).toHaveBeenCalled();
    });
  });

  it('does nothing with reduced motion', async () => {
    mockReducedMotion(true);
    const { fixture, element } = create();
    await fixture.whenStable();

    expect(element.getAttribute('style')).toBeNull();
  });

  it('does nothing on the server', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const { fixture, element } = create();
    await fixture.whenStable();

    expect(element.getAttribute('style')).toBeNull();
  });
});
