import { TestBed } from '@angular/core/testing';
import { PHOTOS } from './manifest';
import { Photo } from './photo';

const photos = PHOTOS as Record<string, { widths: readonly number[] }>;

async function render(name: string) {
  const fixture = TestBed.createComponent(Photo);
  fixture.componentRef.setInput('name', name);
  fixture.componentRef.setInput('alt', 'Hands lifting cloth from a dye pit.');
  fixture.componentRef.setInput('ratio', '16 / 9');
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('Photo', () => {
  afterEach(() => {
    delete photos['test-photo'];
  });

  it('serves a photo the images target made, at every width', async () => {
    photos['test-photo'] = { widths: [480, 1080] };

    const image = (await render('test-photo')).querySelector('img');

    expect(image?.getAttribute('alt')).toBe(
      'Hands lifting cloth from a dye pit.',
    );
    expect(image?.getAttribute('srcset')).toContain(
      'images/test-photo-480.webp 480w',
    );
    expect(image?.getAttribute('srcset')).toContain(
      'images/test-photo-1080.webp 1080w',
    );
  });

  it('holds the place of a photo still to come, with the same alt text', async () => {
    const box = await render('not-yet');

    expect(box.querySelector('img')).toBeNull();
    expect(box.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe(
      'Hands lifting cloth from a dye pit.',
    );
    expect((box.firstElementChild as HTMLElement).style.aspectRatio).toBe(
      '16 / 9',
    );
  });
});
