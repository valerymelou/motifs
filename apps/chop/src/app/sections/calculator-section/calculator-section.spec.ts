import { TestBed } from '@angular/core/testing';
import { CalculatorSection } from './calculator-section';

describe('CalculatorSection', () => {
  async function render() {
    const fixture = TestBed.createComponent(CalculatorSection);
    await fixture.whenStable();
    return { fixture, page: fixture.nativeElement as HTMLElement };
  }

  it('draws the example: ten bars, the first one as this turn', async () => {
    const { page } = await render();

    const bars = page.querySelectorAll('rect.bar');
    expect(bars).toHaveLength(10);
    expect(bars[0]?.classList).toContain('is-turn');
    expect(page.textContent).toContain('The pot: 250,000 FCFA');
    expect(page.textContent).toContain('October 2027');
  });

  it('keeps the table for screen readers and shows it on request', async () => {
    const { fixture, page } = await render();
    const table = page.querySelector('.turns') as HTMLElement;

    expect(table.classList).toContain('sr-only');
    expect(table.querySelectorAll('tbody tr')).toHaveLength(10);

    (page.querySelector('button[ndToggle]') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(table.classList).not.toContain('sr-only');
    expect((page.querySelector('.chart') as HTMLElement).hidden).toBe(true);
  });

  it('marks a new year on the axis', async () => {
    const { fixture, page } = await render();
    fixture.componentRef.instance['start'].set('10');
    await fixture.whenStable();

    const labels = [...page.querySelectorAll('[ndChartAxis] span')].map(
      (label) => label.textContent?.trim(),
    );
    expect(labels.slice(0, 4)).toEqual(['Nov', 'Dec', 'Jan ’28', 'Feb']);
  });

  it('keeps each January on a crowded axis', async () => {
    const { fixture, page } = await render();
    fixture.componentRef.instance['members'].set(20);
    fixture.componentRef.instance['start'].set('9');
    await fixture.whenStable();

    const labels = [...page.querySelectorAll('[ndChartAxis] span')].map(
      (label) => label.textContent?.trim(),
    );
    expect(labels).toContain('Jan ’28');
    expect(labels).toContain('Jan ’29');
    expect(labels).not.toContain('Dec');
  });

  it('announces the circle once the controls settle, not on load', async () => {
    const settle = () => new Promise((resolve) => setTimeout(resolve, 800));
    const { fixture, page } = await render();
    const live = page.querySelector(
      ':scope > section > div > p[aria-live]',
    ) as HTMLElement;
    await settle();
    fixture.detectChanges();
    expect(live.textContent?.trim()).toBe('');

    fixture.componentRef.instance['members'].set(6);
    await fixture.whenStable();
    await settle();
    fixture.detectChanges();

    expect(live.textContent?.trim()).toBe(
      '6 members at 25,000\u00a0FCFA: each takes 150,000\u00a0FCFA once; the last turn is June 2027.',
    );
  });
});
