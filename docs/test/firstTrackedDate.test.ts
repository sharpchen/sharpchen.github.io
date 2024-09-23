import { execSync, spawn, spawnSync } from 'node:child_process';
import { basename, dirname } from 'node:path';
import * as fs from 'node:fs';
import { expect, test } from 'vitest';
import path from 'node:path';
import { documentRoot, projectRoot } from '../shared/FileSystem';

test('', () => {
  const foo = spawnSync('git', [
    'log',
    '--diff-filter=A',
    '--format="%cI"',
    '--',
    `'${path.join(documentRoot().fullName, 'docs/test/firstTrackedDate.test.ts')}'`,
  ]).stdout.toString();
  expect(foo.startsWith('2024')).toBe(true);
});
