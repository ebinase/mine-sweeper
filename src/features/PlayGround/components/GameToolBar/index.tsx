'use client';

import type { GameMode, MineSweeper } from '@/features/PlayGround/hooks/useMineSweeper';

type Props = Pick<MineSweeper, 'init' | 'gameMode' | 'settings'>;

export const GameToolBar: React.FC<Props> = ({ init, gameMode, settings }) => {
  return (
    <div className='felx justify-start'>
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
  );
};

export default GameToolBar;
