'use client';

import { useCallback, useEffect, useRef } from 'react';
import Cell from './components/Cell';
import useConfetti from '@/hooks/useConfetti';
import usePlayGround, { GameMode } from './hooks/usePlayGround';
import { Header } from './components/Header';
import { toMarixPosition } from './functions/matrix';

const PlayGround = () => {
  const { board, gameState, gameMode, dispatch, flags } = usePlayGround();
  const confetti = useConfetti();
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameState !== 'completed') return;

    confetti.showBoth();

    const timerId = setInterval(() => {
      setTimeout(() => {
        confetti.showLeft();
      }, Math.random() * 1500);
      setTimeout(() => {
        confetti.showRight();
      }, Math.random() * 1500);
    }, 3000);

    return () => clearInterval(timerId);
  }, [gameState, confetti]);

  useEffect(() => {
    // TODO: もっとわかりやすいUIにする
    const boardElement = boardRef.current;
    if (!boardElement) return;
    // 盤面サイズが正しく図れるようにする
    boardElement.classList.remove('p-2');
    // スクロール可能な場合は見た目が分かりやすくなるようpaddingを追加する
    const isScrollable = boardElement.scrollHeight > boardElement.clientHeight;
    if (isScrollable) {
      boardElement.classList.add('p-2');
    }
  }, [gameMode]);

  const handleClick = useCallback((index: number) => dispatch({ type: 'open', index }), [dispatch]);
  const toggleFlag = useCallback(
    (index: number) => dispatch({ type: 'toggleFlag', index }),
    [dispatch],
  );
  const switchFlagType = useCallback(
    (index: number) => dispatch({ type: 'switchFlagType', index }),
    [dispatch],
  );

  return (
    <div>
      <Header normalFlags={flags.normal} suspectedFlags={flags.suspected} boardConfig={board.meta} />
      <div
        className={
          'overflow-auto w-fit h-fit max-w-[90vw] max-h-[55vh] md:max-h-[70vh] bg-black/50 dark:bg-white/50 select-none'
        }
        ref={boardRef}
      >
        <div
          className={'bg-slate-700 grid gap-1 p-2 w-fit'}
          style={{
            gridTemplateColumns: `repeat(${board.meta.cols}, 1fr)`,
            gridTemplateRows: `repeat(${board.meta.rows}, 1fr)`,
          }}
        >
          {board.data.flat().map((cell) => {
            const [row, col] = toMarixPosition(cell.id, board.meta.cols);
            return (
              <Cell
                key={cell.id}
                cell={cell}
                row={row}
                col={col}
                isFailed={gameState === 'failed'}
                handleClick={handleClick}
                toggleFlag={toggleFlag}
                switchFlagType={switchFlagType}
              />
            );
          })}
        </div>
      </div>
      <div className='py-2'>
        <select
          className='bg-slate-500 p-1 rounded-none text-sm text-slate-100 focus:bg-slate-400 focus:scale-110 origin-left'
          onChange={(e) => {
            dispatch({ type: 'init', gameMode: e.target.value as GameMode });
          }}
        >
          <option defaultChecked={gameMode === 'easy'} value='easy'>
            Easy
          </option>
          <option defaultChecked={gameMode === 'normal'} value='normal'>
            Normal
          </option>
          <option defaultChecked={gameMode === 'hard'} value='hard'>
            Hard
          </option>
        </select>
      </div>

      {(gameState === 'completed' || gameState === 'failed') && (
        <div className='flex flex-col items-center py-10 gap-3'>
          <button
            className='bg-slate-500 shadow-[2px_2px_2px_#444,-1px_-1px_1px_#fff] text-white px-3 py-1 text-sm focus:bg-slate-400 focus:scale-110 origin-center'
            onClick={() => {
              dispatch({ type: 'reset' });
            }}
          >
            NEW GAME
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayGround;
