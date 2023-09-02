'use client';

import { useEffect } from 'react';
import Cell from './components/Cell';
import useConfetti from '@/hooks/useConfetti';
import usePlayGround from './hooks/usePlayGround';

// グローバルメニュー
// TODO: タイマー
// TODO: リセットボタン
// TODO: 絵文字
// TODO: 難易度選択

const PlayGround = () => {
  const settings = { rows: 8, cols: 8, mines: 10 };
  const { board, gameState, init, open } = usePlayGround(settings);
  const confetti = useConfetti();

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

  return (
    <div>
      <h1>Mine Sweeper - Classic</h1>
      <div
        className={
          'bg-slate-700 w-[90vmin] h-[90vmin] md:w-[60vmin] md:h-[60vmin] grid grid-cols-8 grid-rows-[8] md:gap-2 gap-1 p-2'
        }
      >
        {board.flat().map((cell, j) => {
          return (
            <Cell
              key={j}
              cell={cell}
              handleClick={() => open(j)}
              isFailed={gameState === 'lose'}
            ></Cell>
          );
        })}
      </div>
      <div className='flex flex-col items-center py-10 gap-3'>
        {gameState !== 'playing' && (
          <button
            className='bg-slate-500 shadow-[2px_2px_2px_#444,-1px_-1px_1px_#fff] text-white px-3 py-1 text-sm'
            onClick={() => init(settings)}
          >
            NEW GAME
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayGround;
