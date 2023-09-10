'use client';

import { useEffect, useRef } from 'react';
import Cell from './components/Cell';
import useConfetti from '@/hooks/useConfetti';
import usePlayGround, { GameMode } from './hooks/usePlayGround';
import Image from 'next/image';

// グローバルメニュー
// TODO: タイマー
// TODO: リセットボタン
// TODO: 絵文字
// TODO: 難易度選択

const PlayGround = () => {
  const { board, gameState, reset, init, open, countFlags, toggleFlag, mode } = usePlayGround();
  const confetti = useConfetti();
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameState !== 'win') return;

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
  }, [mode]);

  return (
    <div>
      <header className='flex justify-between items-center py-0.5'>
        <h1>Mine Sweeper</h1>
        <div className='flex gap-2'>
          <div className='flex items-center'>
            <Image src='/flag.png' alt='flag' width={15} height={15} />
            <span className='text-xs'>×{countFlags()}</span>
          </div>
          <div className='flex items-center'>
            <Image src='/mine.svg' alt='exploded mine' width={15} height={15} />
            <span className='text-xs'>×{board.meta.mines}</span>
          </div>
        </div>
      </header>
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
            return (
              <Cell
                key={cell.id}
                cell={cell}
                handleClick={open}
                isFailed={gameState === 'lose'}
                toggleFlag={toggleFlag}
              ></Cell>
            );
          })}
        </div>
      </div>
      <div className='py-2'>
        <select
          className='bg-slate-500 p-1 rounded-none text-sm'
          onChange={(e) => {
            init(e.target.value as GameMode);
          }}
        >
          <option defaultChecked={mode === 'easy'} value='easy'>
            Easy
          </option>
          <option defaultChecked={mode === 'normal'} value='normal'>
            Normal
          </option>
          <option defaultChecked={mode === 'hard'} value='hard'>
            Hard
          </option>
        </select>
      </div>

      {gameState !== 'playing' && (
        <div className='flex flex-col items-center py-10 gap-3'>
          <button
            className='bg-slate-500 shadow-[2px_2px_2px_#444,-1px_-1px_1px_#fff] text-white px-3 py-1 text-sm'
            onClick={reset}
          >
            NEW GAME
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayGround;
