import { PHOTOS } from './manifest';
import { photoFallback, photoSrcset } from './photo-files';

describe('photo files', () => {
  const photos = PHOTOS as Record<
    string,
    { width: number; height: number; widths: readonly number[] }
  >;

  beforeAll(() => {
    photos['test-photo'] = {
      width: 2000,
      height: 1000,
      widths: [480, 1080, 1920],
    };
  });
  afterAll(() => {
    delete photos['test-photo'];
  });

  it('lists every width the images target made', () => {
    expect(photoSrcset('test-photo')).toBe(
      'images/test-photo-480.webp 480w, images/test-photo-1080.webp 1080w, images/test-photo-1920.webp 1920w',
    );
  });

  it('falls back to the largest file', () => {
    expect(photoFallback('test-photo')).toBe('images/test-photo-1920.webp');
  });

  it('has no files for a photo still to come', () => {
    expect(photoSrcset('not-yet')).toBe('');
    expect(photoFallback('not-yet')).toBeUndefined();
  });
});
