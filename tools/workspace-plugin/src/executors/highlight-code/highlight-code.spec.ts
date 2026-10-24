import type { ExecutorContext } from '@nx/devkit';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import executor, { mergeLine } from './highlight-code';

function contextFor(root: string): ExecutorContext {
  return {
    root,
    cwd: root,
    isVerbose: false,
    projectGraph: { nodes: {}, dependencies: {} },
    projectsConfigurations: { projects: {}, version: 2 },
    nxJsonConfiguration: {},
  };
}

describe('highlight-code executor', () => {
  let root: string;
  const options = {
    input: 'samples',
    output: 'src/app/code/samples.generated.ts',
  };
  const generated = () => readFileSync(join(root, options.output), 'utf-8');

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'motifs-code-'));
    mkdirSync(join(root, 'samples'));
  });
  afterEach(() => rmSync(root, { recursive: true, force: true }));

  it('writes each sample under its task and language', async () => {
    writeFileSync(join(root, 'samples/send-sms.py'), 'import requests\n');
    writeFileSync(
      join(root, 'samples/send-sms.sh'),
      'curl -s "https://api.fil.example"\n',
    );

    const { success } = await executor(options, contextFor(root));

    expect(success).toBe(true);
    expect(generated()).toContain('"send-sms":{');
    expect(generated()).toContain('"python":[');
    expect(generated()).toContain('"curl":[');
  });

  it('classes keywords, strings and comments', async () => {
    writeFileSync(
      join(root, 'samples/send-sms.py'),
      'import requests  # send it\nrequests.post("https://api.fil.example")\n',
    );

    await executor(options, contextFor(root));

    expect(generated()).toContain('["k","import"]');
    expect(generated()).toContain('["c","# send it"]');
    expect(generated()).toContain('["s","\\"https://api.fil.example\\""]');
  });

  it('refuses a sample whose name is not lowercase words and hyphens', async () => {
    writeFileSync(join(root, 'samples/Send SMS.py'), 'pass\n');

    expect((await executor(options, contextFor(root))).success).toBe(false);
  });
});

describe('mergeLine', () => {
  it('joins neighbouring tokens of one class and keeps plain text as strings', () => {
    expect(
      mergeLine([
        ['k', 'const'],
        ['', ' '],
        ['', 'x'],
        ['', ' = '],
        ['s', "'a"],
        ['s', "'"],
      ]),
    ).toEqual([['k', 'const '], 'x = ', ['s', "'a'"]]);
  });
});
