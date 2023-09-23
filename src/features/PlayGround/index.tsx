'use client';

import { useEffect, useRef } from 'react';
import useConfetti from '@/hooks/useConfetti';
import useMineSweeper from './hooks/useMineSweeper';
import { GameInfoHeader } from './components/GameInfoHeader';
import Board from './components/Board';
import GameToolBar from './components/GameToolBar';
import GameContextAction from './components/GameContextAction';

const PlayGround = () => {
  const {
    board,
    gameState,
    gameMode,
    init,
    restart,
    open,
    toggleFlag,
    switchFlagType,
    flags,
    settings,
  } = useMineSweeper();
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

  return (
    <div className='flex flex-col items-stretch'>
      <div className='py-0.5'>
        <GameInfoHeader
          normalFlags={flags.normal}
          suspectedFlags={flags.suspected}
          boardConfig={board.meta}
        />
      </div>
      <div
        className={
          'overflow-auto w-fit h-fit max-w-[90vw] max-h-[55vh] md:max-h-[70vh] bg-black/50 dark:bg-white/50 select-none'
        }
        ref={boardRef}
      >
        <Board board={board} open={open} toggleFlag={toggleFlag} switchFlagType={switchFlagType} />
      </div>
      <div className='py-2'>
        <GameToolBar init={init} gameMode={gameMode} settings={settings} />
      </div>

      {(gameState === 'completed' || gameState === 'failed') && (
        <div className='py-10'>
          <GameContextAction restart={restart} />
        </div>
      )}
    </div>
  );
};

export default PlayGround;
