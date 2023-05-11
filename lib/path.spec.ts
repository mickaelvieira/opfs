import { describe, expect, test } from '@jest/globals';
import { basename, directories, dirname, normalize } from './path';

describe('normalize function', () => {
  test.each([
    ['', ''],
    ['    ', ''],
    ['foo', 'foo'],
    ['foo/bar', 'foo/bar'],
    ['/', ''],
    ['///', ''],
    ['/foo/bar/baz/', 'foo/bar/baz'],
    ['//foo/bar/baz///', 'foo/bar/baz'],
    ['foo/bar/baz', 'foo/bar/baz'],
    ['/foo/bar/baz', 'foo/bar/baz'],
  ])('.normalize(%s)', (a: string, expected: string) => {
    expect(normalize(a)).toBe(expected);
  });
});

describe('basename function', () => {
  test.each([
    ['', ''],
    ['  ', ''],
    ['foo', 'foo'],
    ['foo/bar', 'bar'],
    ['/', ''],
    ['///', ''],
    ['/foo/bar/baz', 'baz'],
    ['foo/bar/baz', 'baz'],
  ])('.basename(%s)', (a: string, expected: string) => {
    expect(basename(a)).toBe(expected);
  });
});

describe('dirname function', () => {
  test.each([
    ['', ''],
    ['  ', ''],
    ['foo', ''],
    ['foo/bar', 'foo'],
    ['/', ''],
    ['///', ''],
    ['/foo/bar/baz', 'foo/bar'],
    ['foo/bar/baz', 'foo/bar'],
  ])('.dirname(%s)', (a: string, expected: string) => {
    expect(dirname(a)).toBe(expected);
  });
});

describe('directories function', () => {
  test.each([
    ['', []],
    ['    ', []],
    ['foo', ['foo']],
    ['foo/bar', ['foo', 'bar']],
    ['/', []],
    ['///', []],
    ['/foo/bar/baz/', ['foo', 'bar', 'baz']],
    ['//foo/bar/baz///', ['foo', 'bar', 'baz']],
    ['foo/bar/baz', ['foo', 'bar', 'baz']],
    ['/foo/bar/baz', ['foo', 'bar', 'baz']],
  ])('.normalize(%s)', (a: string, expected: string[]) => {
    expect(directories(a)).toStrictEqual(expected);
  });
});
