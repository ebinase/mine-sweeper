'use client';

import { useEffect, useState } from 'react';
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
  const [zoom, setZoom] = useState(true);

  const handleZoomToggle = () => setZoom(!zoom);

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

  return (
    <div className='h-full pt-[10vh] flex flex-col items-stretch'>
      <div className='py-0.5 flex flex-col justify-end'>
        <GameInfoHeader
          normalFlags={flags.normal}
          suspectedFlags={flags.suspected}
          boardConfig={board.meta}
        />
      </div>
      <Board
        board={board}
        open={open}
        toggleFlag={toggleFlag}
        switchFlagType={switchFlagType}
        zoom={zoom}
      />
      <div className='py-2'>
        <GameToolBar
          init={init}
          gameMode={gameMode}
          settings={settings}
          handleZoomToggle={handleZoomToggle}
        />
      </div>

      {(gameState === 'completed' || gameState === 'failed') && (
        <div className='py-5'>
          <GameContextAction restart={restart} />
        </div>
      )}
    </div>
  );
};

export default PlayGround;
