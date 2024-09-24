import { execSync, spawn, spawnSync } from 'node:child_process';
import { basename, dirname } from 'node:path';
import * as fs from 'node:fs';
import { expect, test } from 'vitest';
import path from 'node:path';
import { documentRoot, projectRoot } from '../shared/FileSystem';

test('', async () => {
  const boo = execSync(
    `git log --diff-filter=A --format="%cI" -- "${path.join(documentRoot().fullName, 'SQL/docs/View/View.md')}"`,
  );
  console.log(boo.toString());
  expect(boo.toString().trim()).toBe('');
  const foo = spawnSync('git', [
    'log',
    '--diff-filter=A',
    '--format="%cI"',
    '--',
    `"${path.join(documentRoot().fullName, 'SQL/docs/View/View.md')}"`,
  ]).stdout.toString();
  // await new Promise(resolve => setTimeout(resolve, 5000));
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  console.log(foo ? foo : 'empty string');
  console.log(`"${path.join(documentRoot().fullName, 'SQL/docs/View/View.md')}"`);
  console.log(documentRoot().fullName);
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  expect(foo.startsWith('2023')).toBe(true);
});
