'use client';

import type { GameMode, MineSweeper } from '@/features/PlayGround/hooks/useMineSweeper';

type Props = Pick<MineSweeper, 'init' | 'gameMode' | 'settings'> & {
  handleZoomToggle: () => void;
};

export const GameToolBar: React.FC<Props> = ({ init, gameMode, settings, handleZoomToggle }) => {
  return (
    <nav className='flex justify-between items-center'>
      <div>
        <select
          className='bg-slate-500 p-1.5 rounded-none text-sm text-slate-100 focus:bg-slate-400 focus:scale-110 origin-left'
          onChange={(e) => {
            init(e.target.value as GameMode);
          }}
          defaultValue={gameMode}
        >
          {settings.gameModeList.map((mode) => (
            <option key={mode} value={mode}>
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button className='text-slate-700 text-xs' onClick={handleZoomToggle}>
          +/-
        </button>
      </div>
    </nav>
  );
};

export default GameToolBar;
