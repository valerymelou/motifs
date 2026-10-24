import { TestBed } from '@angular/core/testing';
import { CodeLanguage, languageName } from './code-language';

/** A Storage stand-in, since the test environment has none. */
function memoryStorage(failWrites = false): Storage {
  const items = new Map<string, string>();
  return {
    get length() {
      return items.size;
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => items.delete(key),
    setItem: (key, value) => {
      if (failWrites) {
        throw new Error('blocked');
      }
      items.set(key, value);
    },
  };
}

describe('CodeLanguage', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('starts on curl', () => {
    vi.stubGlobal('localStorage', memoryStorage());

    expect(TestBed.inject(CodeLanguage).current()).toBe('curl');
  });

  it('remembers a choice for the next visit', () => {
    const storage = memoryStorage();
    vi.stubGlobal('localStorage', storage);

    TestBed.inject(CodeLanguage).set('go');

    expect(storage.getItem('fil:code-language')).toBe('go');
  });

  it('still switches when storage is blocked', () => {
    vi.stubGlobal('localStorage', memoryStorage(true));
    const language = TestBed.inject(CodeLanguage);

    language.set('php');

    expect(language.current()).toBe('php');
  });

  it('names languages as the tabs do', () => {
    expect(languageName('node')).toBe('Node');
    expect(languageName('php')).toBe('PHP');
  });
});
