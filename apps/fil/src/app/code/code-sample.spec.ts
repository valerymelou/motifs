import { TestBed } from '@angular/core/testing';
import { CodeLanguage } from './code-language';
import { CodeSample } from './code-sample';

async function render(task = 'send-sms') {
  const fixture = TestBed.createComponent(CodeSample);
  fixture.componentRef.setInput('task', task);
  fixture.componentRef.setInput('title', 'Send an SMS');
  fixture.componentRef.setInput('sendable', true);
  await fixture.whenStable();
  const element = fixture.nativeElement as HTMLElement;
  const visible = () =>
    element.querySelector<HTMLElement>('[role="tabpanel"]:not([hidden])');
  return { fixture, element, visible };
}

describe('CodeSample', () => {
  it('shows curl first, with every language in the prerendered panels', async () => {
    const { element, visible } = await render();

    expect(element.querySelectorAll('[role="tabpanel"]')).toHaveLength(5);
    expect(visible()?.textContent).toContain('curl https://api.fil.example');
  });

  it('follows the page language', async () => {
    const { fixture, visible } = await render();

    TestBed.inject(CodeLanguage).set('python');
    await fixture.whenStable();

    expect(visible()?.textContent).toContain('from urllib.request import');
  });

  it('colours tokens by class', async () => {
    const { fixture, visible } = await render();

    TestBed.inject(CodeLanguage).set('python');
    await fixture.whenStable();

    expect(visible()?.querySelector('.tk-k')?.textContent).toBe('import');
    expect(visible()?.querySelector('.tk-s')).not.toBeNull();
  });

  it('copies the code of the language shown, as plain text', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    const { fixture, element } = await render();

    element
      .querySelector<HTMLButtonElement>('button[aria-label^="Copy the curl"]')
      ?.click();
    await fixture.whenStable();

    const [text] = writeText.mock.calls[0] ?? [];
    expect(text).toMatch(
      /^curl https:\/\/api\.fil\.example\/v1\/messages \\\n/,
    );
    expect(text).toContain('"channel": "sms",');
  });

  it('sends a test message that gets queued, then delivered', async () => {
    const { fixture, element } = await render();
    vi.useFakeTimers();
    const status = () => element.querySelector('[aria-live]')?.textContent;

    [...element.querySelectorAll('button')]
      .find((button) => button.textContent?.includes('Send test'))
      ?.click();
    fixture.detectChanges();
    expect(status()).toContain('Queued');

    vi.advanceTimersByTime(900);
    fixture.detectChanges();
    expect(status()).toContain('Delivered');
    vi.useRealTimers();
  });
});
