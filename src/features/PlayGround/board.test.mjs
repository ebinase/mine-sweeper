import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createGame, getBoard, transition } from '@ebinas/react-use-minesweeper';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const modules = new Map();

// Render the real board and cells with Node, substituting only Vite's image imports.
function loadComponent(url) {
  if (modules.has(url.href)) return modules.get(url.href);
  const source = ts.transpileModule(readFileSync(url, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const exports = {};
  const localRequire = (name) => {
    if (name === '@/assets/gameImages') {
      return {
        gameImages: { flag: 'flag.png', mine: 'mine.svg', explodedMine: 'mine_explode.svg' },
      };
    }
    if (name === '@/hooks/useLongPress') {
      return loadComponent(new URL('../../hooks/useLongPress.ts', import.meta.url));
    }
    if (name.startsWith('.')) {
      const file = new URL(`${name}.tsx`, url);
      return loadComponent(existsSync(file) ? file : new URL(`${name}/index.tsx`, url));
    }
    return require(name);
  };
  runInNewContext(source, { exports, require: localRequire });
  modules.set(url.href, exports);
  return exports;
}

const Board = loadComponent(new URL('./components/Board/index.tsx', import.meta.url)).default;
const render = (game) =>
  renderToStaticMarkup(
    createElement(Board, {
      board: getBoard(game),
      isLost: game.status === 'lost',
      open() {},
      setFlag() {},
    }),
  );

test('losing explodes every mine, including flagged mines', () => {
  let game = transition(createGame({ seed: 0 }), { type: 'open', cell: 0 });
  game = transition(game, { type: 'setFlag', cell: game.mines[0], flag: 'flag' });
  game = transition(game, { type: 'open', cell: game.mines[1] });
  assert.equal(game.status, 'lost');
  const html = render(game);
  assert.equal((html.match(/alt="exploded mine"/g) ?? []).length, game.config.mines);
  assert.equal((html.match(/bg-red-800/g) ?? []).length, game.config.mines);
  assert.doesNotMatch(html, /alt="mine"|<button/);
});

test('winning reveals mines without exploding them', () => {
  let game = transition(createGame({ seed: 0 }), { type: 'open', cell: 0 });
  for (const cell of getBoard(game).cells) {
    if (!game.mines.includes(cell.id)) {
      game = transition(game, { type: 'open', cell: cell.id });
    }
  }
  assert.equal(game.status, 'won');
  const html = render(game);
  assert.equal((html.match(/alt="mine"/g) ?? []).length, game.config.mines);
  assert.doesNotMatch(html, /alt="exploded mine"|bg-red-800/);
});

test('restarting after a loss hides every cell and clears explosion images', () => {
  let game = transition(createGame({ seed: 0 }), { type: 'open', cell: 0 });
  game = transition(game, { type: 'open', cell: game.mines[0] });
  game = transition(game, { type: 'restart' });
  const html = render(game);
  assert.equal((html.match(/<button/g) ?? []).length, game.config.rows * game.config.cols);
  assert.doesNotMatch(html, /alt="exploded mine"|bg-red-800/);
});
