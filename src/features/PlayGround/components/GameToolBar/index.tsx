'use client';

import {
  GAME_MODE_LIST,
  type GameMode,
  type MineSweeper,
} from '@/features/PlayGround/hooks/useMineSweeper';
import { useRouter } from 'next/navigation';

type Props = Pick<MineSweeper, 'gameMode' | 'settings'>;

export const GameToolBar: React.FC<Props> = ({ gameMode, settings }) => {
  const router = useRouter();

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gameMode = e.target.value as GameMode;
    if (!GAME_MODE_LIST.includes(gameMode)) router.replace('/404');
    router.push(`/play/${gameMode}`);
  };
  return (
    <nav className='felx justify-start'>
      <select
        className='bg-slate-500 p-1.5 rounded-none text-sm text-slate-100 focus:bg-slate-400 focus:scale-110 origin-left'
        onChange={handleOnChange}
        defaultValue={gameMode}
      >
        {settings.gameModeList.map((mode) => (
          <option key={mode} value={mode}>
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </option>
        ))}
      </select>
    </nav>
  );
};

export default GameToolBar;
