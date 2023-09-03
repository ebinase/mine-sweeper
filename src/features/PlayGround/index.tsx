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
  const { board, gameState, reset, open } = usePlayGround();
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
        className={'bg-slate-700 w-[90vmin] md:w-[60vmin] grid gap-1 p-2'}
        style={{
          gridTemplateColumns: `repeat(${board[0].length}, 1fr)`,
          gridTemplateRows: `repeat(${board.length}, 1fr)`,
        }}
      >
        {board.flat().map((cell) => {
          return (
            <Cell
              key={cell.id}
              cell={cell}
              handleClick={open}
              isFailed={gameState === 'lose'}
            ></Cell>
          );
        })}
      </div>
      <div className='flex flex-col items-center py-10 gap-3'>
        {gameState !== 'playing' && (
          <button
            className='bg-slate-500 shadow-[2px_2px_2px_#444,-1px_-1px_1px_#fff] text-white px-3 py-1 text-sm'
            onClick={reset}
          >
            NEW GAME
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayGround;
