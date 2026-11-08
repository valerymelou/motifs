import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('renders the headline, the seven sections and the closing ring', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('h1')?.textContent).toContain(
      'Ten friends. One pot. Every turn comes.',
    );
    expect(
      [...page.querySelectorAll('[id]')]
        .map((el) => el.id)
        .filter((id) =>
          [
            'year',
            'circle',
            'month',
            'book',
            'dues',
            'questions',
            'full-circle',
          ].includes(id),
        ),
    ).toEqual([
      'year',
      'circle',
      'month',
      'book',
      'dues',
      'questions',
      'full-circle',
    ]);
    expect(page.querySelector('footer')?.textContent).toContain(
      'Chop is part of Motifs by Valery Melou.',
    );
  });
});
