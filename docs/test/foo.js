import { spawnSync } from 'node:child_process';
import { basename, dirname } from 'node:path';
import path from 'node:path';
import { projectRoot } from '../shared/FileSystem';

const foo = spawnSync('git', [
  'log',
  '-1',
  '--pretty="%ai"',
  path.join(projectRoot(), 'package.json'),
]).stdout.toString();
