import { useEffect, useRef, useState } from 'react';
import useConfetti from '@/hooks/useConfetti';
import { useMinesweeper } from '@ebinas/react-use-minesweeper/react';
import { GameInfoHeader } from './components/GameInfoHeader';
import Board from './components/Board';
import GameToolBar from './components/GameToolBar';
import GameContextAction from './components/GameContextAction';
import HelpDialog from './components/HelpDialog';

const PlayGround = () => {
  const { game, board, stats, reset, restart, open, setFlag } = useMinesweeper();
  const confetti = useConfetti();
  const boardRef = useRef<HTMLDivElement>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showGuideHint, setShowGuideHint] = useState(false);

  useEffect(() => {
    if (game.status !== 'won') return;

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
  }, [game.status, confetti]);

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
  }, [game.config]);

  useEffect(() => {
    const storageKey = 'ms-guide-seen';
    try {
      if (localStorage.getItem(storageKey)) return;
      setShowGuideHint(true);
    } catch {
      setShowGuideHint(true);
    }
  }, []);

  const openHelp = () => {
    setIsHelpOpen(true);
    if (showGuideHint) {
      setShowGuideHint(false);
      try {
        localStorage.setItem('ms-guide-seen', '1');
      } catch {
        // Ignore storage failures.
      }
    }
  };

  return (
    <div className='max-h-full flex flex-col items-stretch'>
      <div className='shrink-0 py-0.5 flex flex-col justify-end'>
        <GameInfoHeader
          normalFlags={stats.flags}
          suspectedFlags={stats.questions}
          boardConfig={board.config}
        />
      </div>
      <div
        className={
          'overflow-auto max-w-[90vw] max-h-[55dvh] md:max-h-[62dvh] xl:max-h-[70dvh] bg-black/50 dark:bg-white/50'
        }
        ref={boardRef}
      >
        <Board board={board} isLost={game.status === 'lost'} open={open} setFlag={setFlag} />
      </div>
      <div className='shrink-0 py-2 flex justify-between'>
        <GameToolBar reset={reset} preset={game.preset ?? 'easy'} />
        <button
          type='button'
          className={
            showGuideHint
              ? 'px-2 py-1 text-[0.65rem] sm:text-xs text-slate-500/90 tracking-wide hover:text-slate-700/90'
              : 'px-2 py-1 text-[0.65rem] sm:text-xs text-slate-500/90 bg-transparent opacity-0 hover:opacity-100 focus-visible:opacity-100 transition-opacity'
          }
          onClick={openHelp}
          aria-label='Help'
        >
          <span className='leading-none'>GUIDE</span>
        </button>
      </div>

      <div
        className={`shrink-0 py-5 ${
          game.status === 'won' || game.status === 'lost' ? 'visible' : 'invisible'
        }`}
      >
        <GameContextAction restart={restart} />
      </div>
      <HelpDialog isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default PlayGround;
