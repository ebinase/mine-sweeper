'use client';

import { useEffect, useRef, useState } from 'react';
import useConfetti from '@/hooks/useConfetti';
import { useMinesweeper } from '@ebinas/react-use-minesweeper';
import { GameInfoHeader } from './components/GameInfoHeader';
import Board from './components/Board';
import GameToolBar from './components/GameToolBar';
import GameContextAction from './components/GameContextAction';
import HelpDialog from './components/HelpDialog';

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
  } = useMinesweeper();
  const confetti = useConfetti();
  const boardRef = useRef<HTMLDivElement>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

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
    <div className='h-full pt-[10vh] flex flex-col items-stretch'>
      <div className='py-0.5 flex flex-col justify-end'>
        <GameInfoHeader
          normalFlags={flags.normal}
          suspectedFlags={flags.suspected}
          boardConfig={board.meta}
        />
      </div>
      <div
        className={
          'overflow-auto max-w-[90vw] max-h-[55vh] md:max-h-[62vh] xl:max-h-[70vh] bg-black/50 dark:bg-white/50'
        }
        ref={boardRef}
      >
        <Board board={board} open={open} toggleFlag={toggleFlag} switchFlagType={switchFlagType} />
      </div>
      <div className='py-2 flex justify-between'>
        <GameToolBar init={init} gameMode={gameMode} settings={settings} />
        <button
          type='button'
          className='flex items-center justify-center w-6 h-6 text-[0.7rem] text-slate-500/90 bg-slate-200/40 border border-slate-300/70 rounded-sm hover:bg-slate-200/70 hover:text-slate-700/90'
          onClick={() => setIsHelpOpen(true)}
          aria-label='Help'
        >
          <span className='leading-none'>?</span>
        </button>
      </div>

      {(gameState === 'completed' || gameState === 'failed') && (
        <div className='py-5'>
          <GameContextAction restart={restart} />
        </div>
      )}
      <HelpDialog isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default PlayGround;
