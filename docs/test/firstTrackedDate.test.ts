import { execSync, spawn, spawnSync } from 'node:child_process';
import { basename, dirname } from 'node:path';
import * as fs from 'node:fs';
import { expect, test } from 'vitest';
import path from 'node:path';
import { projectRoot } from '../shared/FileSystem';

// test('expect date', () => {
//   const foo = spawnSync('git', [
//     'log',
//     '-1',
//     '--pretty="%ai"',
//     path.join(projectRoot().fullName, 'package.json'),
//   ]).stdout.toString();
//   expect(foo.startsWith('2024')).toBe(true);
// });
test('', () => {
  expect(projectRoot().parent?.fullName).toBe('/home/sharpchen/desktop/repo/sharpchen.github.io');
});
