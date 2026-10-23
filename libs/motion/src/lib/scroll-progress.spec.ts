import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  mockAnimationFrames,
  mockBox,
  mockReducedMotion,
} from '../testing/browser-mocks';
import { ScrollProgress } from './scroll-progress';

@Component({
  imports: [ScrollProgress],
  template: `<section mtScrollProgress="contain">Story</section>`,
})
class Host {
  readonly tracker = viewChild.required(ScrollProgress);
}

function create() {
  const fixture = TestBed.createComponent(Host);
  const element: HTMLElement = fixture.nativeElement.querySelector('section');
  return { fixture, element };
}

describe('ScrollProgress', () => {
  beforeEach(() => {
    mockAnimationFrames();
    vi.stubGlobal('innerHeight', 800);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('exposes progress as a signal and a custom property', async () => {
    mockReducedMotion(false);
    const { fixture, element } = create();
    mockBox(element, -400, 1600);
    await fixture.whenStable();

    expect(fixture.componentInstance.tracker().progress()).toBe(0.5);
    expect(element.style.getPropertyValue('--mt-scroll-progress')).toBe('0.5');
  });

  it('stays at 0 with reduced motion', async () => {
    mockReducedMotion(true);
    const { fixture, element } = create();
    mockBox(element, -400, 1600);
    await fixture.whenStable();

    expect(fixture.componentInstance.tracker().progress()).toBe(0);
  });
});
