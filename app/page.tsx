'use client';

import { useEffect, useState } from 'react';

interface TestResult {
  name: string;
  description: string;
  passed: boolean;
  error?: string;
  chrome: string;
  safari: string;
}

export default function PolyfillTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const tests = [
    {
      name: 'Array.prototype.at',
      description: 'Access array elements with negative indices',
      chrome: 'Chrome 92+',
      safari: 'Safari 15.4+',
      test: () => {
        const arr = [1, 2, 3, 4, 5];
        const result1 = arr.at(-1);
        const result2 = arr.at(2);
        if (result1 !== 5 || result2 !== 3) {
          throw new Error(`Expected at(-1) = 5 and at(2) = 3, got ${result1} and ${result2}`);
        }
      }
    },
    {
      name: 'Object.assign',
      description: 'Copy properties from source objects to target object',
      chrome: 'Chrome 45+',
      safari: 'Safari 9+',
      test: () => {
        const target = { a: 1 };
        const source = { b: 2, c: 3 };
        const result = Object.assign(target, source);
        if (result.a !== 1 || result.b !== 2 || result.c !== 3) {
          throw new Error('Object.assign failed');
        }
      }
    },
    {
      name: 'Array.prototype.includes',
      description: 'Check if array contains a specific element',
      chrome: 'Chrome 47+',
      safari: 'Safari 9+',
      test: () => {
        const arr = [1, 2, 3, 4, 5];
        if (!arr.includes(3) || arr.includes(10)) {
          throw new Error('Array.includes failed');
        }
      }
    },
    {
      name: 'String.prototype.includes',
      description: 'Check if string contains a substring',
      chrome: 'Chrome 41+',
      safari: 'Safari 9+',
      test: () => {
        const str = 'Hello World';
        if (!str.includes('World') || str.includes('xyz')) {
          throw new Error('String.includes failed');
        }
      }
    },
    {
      name: 'Promise',
      description: 'Handle asynchronous operations',
      chrome: 'Chrome 32+',
      safari: 'Safari 8+',
      test: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve('success'), 10);
        }).then(result => {
          if (result !== 'success') {
            throw new Error('Promise failed');
          }
        });
      }
    },
    {
      name: 'Array.from',
      description: 'Convert array-like or iterable objects to arrays',
      chrome: 'Chrome 45+',
      safari: 'Safari 9+',
      test: () => {
        const set = new Set([1, 2, 3]);
        const arr = Array.from(set);
        if (arr.length !== 3 || arr[0] !== 1) {
          throw new Error('Array.from failed');
        }
      }
    },
    {
      name: 'Object.entries',
      description: 'Return key-value pairs of an object as array',
      chrome: 'Chrome 54+',
      safari: 'Safari 10.1+',
      test: () => {
        const obj = { a: 1, b: 2 };
        const entries = Object.entries(obj);
        if (entries.length !== 2 || entries[0][0] !== 'a' || entries[0][1] !== 1) {
          throw new Error('Object.entries failed');
        }
      }
    },
    {
      name: 'Array.prototype.flat',
      description: 'Flatten nested arrays',
      chrome: 'Chrome 69+',
      safari: 'Safari 12+',
      test: () => {
        const arr = [1, [2, 3], [4, [5, 6]]];
        const flat1 = arr.flat();
        const flat2 = arr.flat(2);
        if (flat1.length !== 5 || flat2.length !== 6) {
          throw new Error(`Expected flat() length 5 and flat(2) length 6, got ${flat1.length} and ${flat2.length}`);
        }
      }
    },
    {
      name: 'String.prototype.replaceAll',
      description: 'Replace all occurrences of a substring',
      chrome: 'Chrome 85+',
      safari: 'Safari 13.1+',
      test: () => {
        const str = 'hello world hello';
        const result = str.replaceAll('hello', 'hi');
        if (result !== 'hi world hi') {
          throw new Error(`Expected "hi world hi", got "${result}"`);
        }
      }
    },
    {
      name: 'Symbol.iterator',
      description: 'Make objects iterable with custom iterator',
      chrome: 'Chrome 38+',
      safari: 'Safari 9+',
      test: () => {
        const iterableObj = {
          data: [1, 2, 3],
          [Symbol.iterator]() {
            let index = 0;
            const data = this.data;
            return {
              next() {
                if (index < data.length) {
                  return { value: data[index++], done: false };
                }
                return { done: true, value: undefined };
              }
            };
          }
        };

        const result = [...iterableObj];
        if (result.length !== 3 || result[0] !== 1 || result[2] !== 3) {
          throw new Error('Iterator failed');
        }
      }
    },
    {
      name: 'Object.values',
      description: 'Return values of an object as array',
      chrome: 'Chrome 54+',
      safari: 'Safari 10.1+',
      test: () => {
        const obj = { a: 1, b: 2, c: 3 };
        const values = Object.values(obj);
        if (values.length !== 3 || !values.includes(1) || !values.includes(2)) {
          throw new Error('Object.values failed');
        }
      }
    },
    {
      name: 'String.prototype.padStart',
      description: 'Pad string from the start to specified length',
      chrome: 'Chrome 57+',
      safari: 'Safari 10+',
      test: () => {
        const str = '5';
        const result = str.padStart(3, '0');
        if (result !== '005') {
          throw new Error(`Expected "005", got "${result}"`);
        }
      }
    },
    {
      name: 'String.prototype.padEnd',
      description: 'Pad string from the end to specified length',
      chrome: 'Chrome 57+',
      safari: 'Safari 10+',
      test: () => {
        const str = 'test';
        const result = str.padEnd(8, '.');
        if (result !== 'test....') {
          throw new Error(`Expected "test....", got "${result}"`);
        }
      }
    },
    {
      name: 'Array.prototype.flatMap',
      description: 'Map and flatten arrays in one operation',
      chrome: 'Chrome 69+',
      safari: 'Safari 12+',
      test: () => {
        const arr = [1, 2, 3];
        const result = arr.flatMap(x => [x, x * 2]);
        if (result.length !== 6 || result[0] !== 1 || result[1] !== 2) {
          throw new Error('flatMap failed');
        }
      }
    },
    {
      name: 'Promise.allSettled',
      description: 'Wait for all promises to settle regardless of outcome',
      chrome: 'Chrome 76+',
      safari: 'Safari 13+',
      test: () => {
        return Promise.allSettled([
          Promise.resolve(1),
          Promise.reject('error'),
          Promise.resolve(3)
        ]).then(results => {
          if (results.length !== 3 || results[0].status !== 'fulfilled' || results[1].status !== 'rejected') {
            throw new Error('Promise.allSettled failed');
          }
        });
      }
    },
    {
      name: 'String.prototype.startsWith',
      description: 'Check if string starts with specified substring',
      chrome: 'Chrome 41+',
      safari: 'Safari 9+',
      test: () => {
        const str = 'Hello World';
        if (!str.startsWith('Hello') || str.startsWith('World')) {
          throw new Error('String.startsWith failed');
        }
      }
    },
    {
      name: 'String.prototype.endsWith',
      description: 'Check if string ends with specified substring',
      chrome: 'Chrome 41+',
      safari: 'Safari 9+',
      test: () => {
        const str = 'Hello World';
        if (!str.endsWith('World') || str.endsWith('Hello')) {
          throw new Error('String.endsWith failed');
        }
      }
    },
    {
      name: 'Array.prototype.find',
      description: 'Find first element matching condition',
      chrome: 'Chrome 45+',
      safari: 'Safari 8+',
      test: () => {
        const arr = [1, 2, 3, 4, 5];
        const result = arr.find(x => x > 3);
        if (result !== 4) {
          throw new Error(`Expected 4, got ${result}`);
        }
      }
    },
    {
      name: 'Array.prototype.findIndex',
      description: 'Find index of first element matching condition',
      chrome: 'Chrome 45+',
      safari: 'Safari 8+',
      test: () => {
        const arr = [1, 2, 3, 4, 5];
        const result = arr.findIndex(x => x > 3);
        if (result !== 3) {
          throw new Error(`Expected 3, got ${result}`);
        }
      }
    },
    {
      name: 'Object.keys',
      description: 'Return keys of an object as array',
      chrome: 'Chrome 5+',
      safari: 'Safari 5+',
      test: () => {
        const obj = { a: 1, b: 2, c: 3 };
        const keys = Object.keys(obj);
        if (keys.length !== 3 || !keys.includes('a') || !keys.includes('b')) {
          throw new Error('Object.keys failed');
        }
      }
    },
    {
      name: 'Object.hasOwn',
      description: 'Safer alternative to hasOwnProperty',
      chrome: 'Chrome 93+',
      safari: 'Safari 15.4+',
      test: () => {
        const obj = { a: 1 };
        if (!Object.hasOwn(obj, 'a') || Object.hasOwn(obj, 'b')) {
          throw new Error('Object.hasOwn failed');
        }
      }
    },
    {
      name: 'Object.fromEntries',
      description: 'Create object from key-value pairs',
      chrome: 'Chrome 73+',
      safari: 'Safari 12.1+',
      test: () => {
        const entries = [['a', 1], ['b', 2]];
        const obj = Object.fromEntries(entries);
        if (obj.a !== 1 || obj.b !== 2) {
          throw new Error('Object.fromEntries failed');
        }
      }
    },
    {
      name: 'String.prototype.trimStart',
      description: 'Remove whitespace from start of string',
      chrome: 'Chrome 66+',
      safari: 'Safari 12+',
      test: () => {
        const str = '  hello  ';
        const result = str.trimStart();
        if (result !== 'hello  ') {
          throw new Error(`Expected "hello  ", got "${result}"`);
        }
      }
    },
    {
      name: 'String.prototype.trimEnd',
      description: 'Remove whitespace from end of string',
      chrome: 'Chrome 66+',
      safari: 'Safari 12+',
      test: () => {
        const str = '  hello  ';
        const result = str.trimEnd();
        if (result !== '  hello') {
          throw new Error(`Expected "  hello", got "${result}"`);
        }
      }
    },
    {
      name: 'Promise.any',
      description: 'Resolve when any promise resolves',
      chrome: 'Chrome 85+',
      safari: 'Safari 14+',
      test: () => {
        return Promise.any([
          Promise.reject('error1'),
          Promise.resolve(2),
          Promise.resolve(3)
        ]).then(result => {
          if (result !== 2) {
            throw new Error(`Expected 2, got ${result}`);
          }
        });
      }
    },
    {
      name: 'String.prototype.matchAll',
      description: 'Get all regex matches with capture groups',
      chrome: 'Chrome 73+',
      safari: 'Safari 13+',
      test: () => {
        const str = 'test1 test2';
        const matches = [...str.matchAll(/test(\d)/g)];
        if (matches.length !== 2 || matches[0][1] !== '1' || matches[1][1] !== '2') {
          throw new Error('String.matchAll failed');
        }
      }
    },
    {
      name: 'globalThis',
      description: 'Standard way to access global object',
      chrome: 'Chrome 71+',
      safari: 'Safari 12.1+',
      test: () => {
        if (typeof globalThis === 'undefined') {
          throw new Error('globalThis is not defined');
        }
        if (globalThis !== globalThis.globalThis) {
          throw new Error('globalThis is not correctly defined');
        }
      }
    },
    {
      name: 'Array.prototype.findLast',
      description: 'Find last element matching condition',
      chrome: 'Chrome 97+',
      safari: 'Safari 15.4+',
      test: () => {
        const arr = [1, 2, 3, 4, 5];
        const result = arr.findLast(x => x > 2);
        if (result !== 5) {
          throw new Error(`Expected 5, got ${result}`);
        }
      }
    },
    {
      name: 'Array.prototype.findLastIndex',
      description: 'Find index of last element matching condition',
      chrome: 'Chrome 97+',
      safari: 'Safari 15.4+',
      test: () => {
        const arr = [1, 2, 3, 4, 5];
        const result = arr.findLastIndex(x => x > 2);
        if (result !== 4) {
          throw new Error(`Expected 4, got ${result}`);
        }
      }
    },
    {
      name: 'Array.prototype.toReversed',
      description: 'Immutable array reverse',
      chrome: 'Chrome 110+',
      safari: 'Safari 16+',
      test: () => {
        const arr = [1, 2, 3];
        const result = arr.toReversed();
        if (result.length !== 3 || result[0] !== 3 || arr[0] !== 1) {
          throw new Error('Array.toReversed failed');
        }
      }
    },
    {
      name: 'Array.prototype.toSorted',
      description: 'Immutable array sort',
      chrome: 'Chrome 110+',
      safari: 'Safari 16+',
      test: () => {
        const arr = [3, 1, 2];
        const result = arr.toSorted();
        if (result.length !== 3 || result[0] !== 1 || arr[0] !== 3) {
          throw new Error('Array.toSorted failed');
        }
      }
    },
    {
      name: 'Array.prototype.toSpliced',
      description: 'Immutable array splice',
      chrome: 'Chrome 110+',
      safari: 'Safari 16+',
      test: () => {
        const arr = [1, 2, 3, 4];
        const result = arr.toSpliced(1, 2, 5);
        if (result.length !== 3 || result[1] !== 5 || arr.length !== 4) {
          throw new Error('Array.toSpliced failed');
        }
      }
    },
    {
      name: 'Array.prototype.with',
      description: 'Immutable array element replacement',
      chrome: 'Chrome 110+',
      safari: 'Safari 16+',
      test: () => {
        const arr = [1, 2, 3];
        const result = arr.with(1, 5);
        if (result.length !== 3 || result[1] !== 5 || arr[1] !== 2) {
          throw new Error('Array.with failed');
        }
      }
    },
    {
      name: 'Iterator',
      description: 'Iterator constructor and protocol support',
      chrome: 'Chrome 122+',
      safari: 'Safari 17.4+',
      test: () => {
        if (typeof Iterator === 'undefined') {
          throw new Error('Iterator is not defined');
        }
        const arr = [1, 2, 3];
        const iterator = arr.values();
        if (!(iterator instanceof Iterator)) {
          throw new Error('Array iterator is not an instance of Iterator');
        }
      }
    },
    {
      name: 'Iterator.prototype.filter',
      description: 'Filter iterator values based on condition',
      chrome: 'Chrome 122+',
      safari: 'Safari 17.4+',
      test: () => {
        const iterator = [1, 2, 3, 4, 5].values();
        if (typeof iterator.filter !== 'function') {
          throw new Error('Iterator.prototype.filter is not available');
        }
        const filtered = iterator.filter(x => x > 2);
        const result = Array.from(filtered);
        if (result.length !== 3 || result[0] !== 3 || result[2] !== 5) {
          throw new Error(`Expected [3,4,5], got [${result}]`);
        }
      }
    },
    {
      name: 'Iterator.prototype.map',
      description: 'Map iterator values to new values',
      chrome: 'Chrome 122+',
      safari: 'Safari 17.4+',
      test: () => {
        const iterator = [1, 2, 3].values();
        if (typeof iterator.map !== 'function') {
          throw new Error('Iterator.prototype.map is not available');
        }
        const mapped = iterator.map(x => x * 2);
        const result = Array.from(mapped);
        if (result.length !== 3 || result[0] !== 2 || result[2] !== 6) {
          throw new Error(`Expected [2,4,6], got [${result}]`);
        }
      }
    },
    {
      name: 'Iterator.prototype.take',
      description: 'Take first N values from iterator',
      chrome: 'Chrome 122+',
      safari: 'Safari 17.4+',
      test: () => {
        const iterator = [1, 2, 3, 4, 5].values();
        if (typeof iterator.take !== 'function') {
          throw new Error('Iterator.prototype.take is not available');
        }
        const taken = iterator.take(3);
        const result = Array.from(taken);
        if (result.length !== 3 || result[0] !== 1 || result[2] !== 3) {
          throw new Error(`Expected [1,2,3], got [${result}]`);
        }
      }
    },
    {
      name: 'Iterator.prototype.drop',
      description: 'Drop first N values from iterator',
      chrome: 'Chrome 122+',
      safari: 'Safari 17.4+',
      test: () => {
        const iterator = [1, 2, 3, 4, 5].values();
        if (typeof iterator.drop !== 'function') {
          throw new Error('Iterator.prototype.drop is not available');
        }
        const dropped = iterator.drop(2);
        const result = Array.from(dropped);
        if (result.length !== 3 || result[0] !== 3 || result[2] !== 5) {
          throw new Error(`Expected [3,4,5], got [${result}]`);
        }
      }
    },
    {
      name: 'Iterator.prototype.every',
      description: 'Check if all iterator values satisfy condition',
      chrome: 'Chrome 122+',
      safari: 'Safari 17.4+',
      test: () => {
        const iterator1 = [2, 4, 6].values();
        const iterator2 = [2, 4, 5].values();
        if (typeof iterator1.every !== 'function') {
          throw new Error('Iterator.prototype.every is not available');
        }
        const result1 = iterator1.every(x => x % 2 === 0);
        const result2 = iterator2.every(x => x % 2 === 0);
        if (!result1 || result2) {
          throw new Error('Iterator.every failed');
        }
      }
    },
    {
      name: 'Iterator.prototype.some',
      description: 'Check if any iterator value satisfies condition',
      chrome: 'Chrome 122+',
      safari: 'Safari 17.4+',
      test: () => {
        const iterator1 = [1, 2, 3].values();
        const iterator2 = [1, 2, 3].values();
        if (typeof iterator1.some !== 'function') {
          throw new Error('Iterator.prototype.some is not available');
        }
        const result1 = iterator1.some(x => x > 2);
        const result2 = iterator2.some(x => x > 10);
        if (!result1 || result2) {
          throw new Error('Iterator.some failed');
        }
      }
    }
  ];

  const runTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    for (const testCase of tests) {
      try {
        await testCase.test();
        results.push({
          name: testCase.name,
          description: testCase.description,
          passed: true,
          chrome: testCase.chrome,
          safari: testCase.safari
        });
      } catch (error) {
        results.push({
          name: testCase.name,
          description: testCase.description,
          passed: false,
          error: error instanceof Error ? error.message : String(error),
          chrome: testCase.chrome,
          safari: testCase.safari
        });
      }
    }

    setTestResults(results);
    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const passedCount = testResults.filter(r => r.passed).length;
  const totalCount = testResults.length;

  return (
    <div className="min-h-screen bg-white text-black font-mono p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl mb-2">POLYFILL TEST</h1>
        <p className="text-sm text-gray-600 mb-8">
          {passedCount}/{totalCount} passed
        </p>

        {isRunning ? (
          <div className="text-sm text-gray-600">Running tests...</div>
        ) : (
          <>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`border p-3 ${
                    result.passed
                      ? 'border-green-600 bg-green-50'
                      : 'border-red-600 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                          {result.passed ? '[✓]' : '[✗]'}
                        </span>
                        <span className="text-sm">{result.name}</span>
                      </div>
                      <div className="mt-1 ml-7 text-xs text-gray-600">
                        {result.description}
                      </div>
                      <div className="mt-1 ml-7 text-xs text-gray-500">
                        {result.chrome} | {result.safari}
                      </div>
                      {!result.passed && result.error && (
                        <div className="mt-2 ml-7 text-xs text-red-700">
                          ERROR: {result.error}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
