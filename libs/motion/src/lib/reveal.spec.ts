import { Component, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  FakeIntersectionObserver,
  mockIntersectionObserver,
  mockReducedMotion,
} from '../testing/browser-mocks';
import { Reveal, Stagger } from './reveal';

@Component({
  imports: [Reveal],
  template: `<p mtReveal mtRevealDelay="50">Hello</p>`,
})
class SingleReveal {}

@Component({
  imports: [Reveal, Stagger],
  template: `
    <ul mtStagger="100">
      <li mtReveal>One</li>
      <li mtReveal>Two</li>
      <li mtReveal>Three</li>
    </ul>
  `,
})
class StaggeredReveals {}

async function render<T>(component: new () => T) {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  return fixture;
}

describe('Reveal', () => {
  beforeEach(() => mockIntersectionObserver());
  afterEach(() => vi.unstubAllGlobals());

  it('hides an element that starts off screen, then reveals it', async () => {
    mockReducedMotion(false);
    const fixture = await render(SingleReveal);
    const element: HTMLElement = fixture.nativeElement.querySelector('p');
    const [observer] = FakeIntersectionObserver.instances;

    observer?.report(false);
    await fixture.whenStable();
    expect(element.style.opacity).toBe('0');
    expect(element.style.transition).toBe('');

    observer?.report(true);
    await fixture.whenStable();
    expect(element.style.opacity).toBe('');
    expect(element.style.transform).toBe('');
    expect(element.style.transition).toContain('50ms');
    expect(observer?.disconnected).toBe(true);
  });

  it('leaves an element that starts on screen untouched', async () => {
    mockReducedMotion(false);
    const fixture = await render(SingleReveal);
    const element: HTMLElement = fixture.nativeElement.querySelector('p');

    FakeIntersectionObserver.instances[0]?.report(true);
    await fixture.whenStable();

    expect(element.getAttribute('style')).toBeNull();
  });

  it('does nothing with reduced motion', async () => {
    mockReducedMotion(true);
    await render(SingleReveal);

    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });

  it('shows a hidden element as soon as reduced motion turns on', async () => {
    const media = mockReducedMotion(false);
    const fixture = await render(SingleReveal);
    const element: HTMLElement = fixture.nativeElement.querySelector('p');

    FakeIntersectionObserver.instances[0]?.report(false);
    media.change(true);
    await fixture.whenStable();

    expect(element.style.opacity).toBe('');
  });

  it('does nothing on the server', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const fixture = await render(SingleReveal);

    expect(FakeIntersectionObserver.instances).toHaveLength(0);
    expect(
      fixture.nativeElement.querySelector('p').getAttribute('style'),
    ).toBeNull();
  });

  it('disconnects its observer when destroyed', async () => {
    mockReducedMotion(false);
    const fixture = await render(SingleReveal);

    fixture.destroy();

    expect(FakeIntersectionObserver.instances[0]?.disconnected).toBe(true);
  });
});

describe('Stagger', () => {
  beforeEach(() => mockIntersectionObserver());
  afterEach(() => vi.unstubAllGlobals());

  it('delays each reveal by its position', async () => {
    mockReducedMotion(false);
    const fixture = await render(StaggeredReveals);
    for (const observer of FakeIntersectionObserver.instances) {
      observer.report(false);
      observer.report(true);
    }
    await fixture.whenStable();

    const items: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('li'),
    );
    expect(items.map((item) => item.style.transition)).toEqual([
      expect.stringContaining(' 0ms'),
      expect.stringContaining(' 100ms'),
      expect.stringContaining(' 200ms'),
    ]);
  });
});
