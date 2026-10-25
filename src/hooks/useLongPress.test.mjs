import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const source = ts.transpileModule(
  readFileSync(new URL('./useLongPress.ts', import.meta.url), 'utf8'),
  {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  },
).outputText;

// Use real React hooks while controlling only the clock and pointer events.
function setup() {
  let now = 0;
  let nextTimer = 0;
  const timers = new Map();
  const window = {
    setTimeout(callback, delay) {
      const id = ++nextTimer;
      timers.set(id, { callback, at: now + delay });
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
  };
  const exports = {};
  runInNewContext(source, { exports, require, window });
  let handlers;
  let clicks = 0;
  let holds = 0;
  function Harness() {
    handlers = exports.default(
      () => holds++,
      () => clicks++,
    );
    return null;
  }
  renderToStaticMarkup(createElement(Harness));
  const event = (overrides = {}) => ({
    button: 0,
    isPrimary: true,
    pointerId: 1,
    clientX: 20,
    clientY: 20,
    preventDefault() {},
    nativeEvent: {},
    ...overrides,
  });
  return {
    send(name, overrides) {
      handlers[name](event(overrides));
    },
    advance(ms) {
      now += ms;
      for (const [id, timer] of timers) {
        if (timer.at <= now) {
          timers.delete(id);
          timer.callback();
        }
      }
    },
    counts() {
      return { clicks, holds };
    },
  };
}

test('a touch shorter than 200ms remains a tap', () => {
  const input = setup();
  input.send('onPointerDown');
  input.advance(199);
  input.send('onPointerUp');
  input.advance(1000);
  assert.deepEqual(input.counts(), { clicks: 1, holds: 0 });
});

test('long press fires once and release does not open the cell', () => {
  const input = setup();
  input.send('onPointerDown');
  input.advance(200);
  input.send('onPointerUp');
  input.send('onPointerUp');
  assert.deepEqual(input.counts(), { clicks: 0, holds: 1 });
  input.send('onPointerDown');
  input.send('onPointerUp');
  assert.deepEqual(input.counts(), { clicks: 1, holds: 1 });
});

for (const name of ['onPointerCancel', 'onPointerLeave']) {
  test(`${name} clears the pending action and the next tap works`, () => {
    const input = setup();
    input.send('onPointerDown');
    input.send(name);
    input.advance(1000);
    input.send('onPointerUp');
    assert.deepEqual(input.counts(), { clicks: 0, holds: 0 });
    input.send('onPointerDown');
    input.send('onPointerUp');
    assert.deepEqual(input.counts(), { clicks: 1, holds: 0 });
  });
}

test('scrolling cancels the action, but small finger movement allows tapping', () => {
  const input = setup();
  input.send('onPointerDown');
  input.send('onPointerMove', { clientY: 40 });
  input.advance(1000);
  input.send('onPointerUp');
  assert.deepEqual(input.counts(), { clicks: 0, holds: 0 });
  input.send('onPointerDown');
  input.send('onPointerMove', { clientY: 23 });
  input.send('onPointerUp');
  assert.deepEqual(input.counts(), { clicks: 1, holds: 0 });
});

test('right click and other fingers cannot complete a primary tap', () => {
  const input = setup();
  input.send('onPointerDown', { button: 2 });
  input.send('onPointerUp', { button: 2 });
  input.send('onPointerDown');
  input.send('onPointerDown', { pointerId: 2, isPrimary: false });
  input.send('onPointerUp', { pointerId: 2 });
  input.send('onPointerCancel', { pointerId: 2 });
  assert.deepEqual(input.counts(), { clicks: 0, holds: 0 });
  input.send('onPointerUp');
  assert.deepEqual(input.counts(), { clicks: 1, holds: 0 });
});
