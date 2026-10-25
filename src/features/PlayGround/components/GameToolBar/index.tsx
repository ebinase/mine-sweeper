import { PRESETS, type Preset } from '@ebinas/react-use-minesweeper';
import type { Minesweeper } from '@ebinas/react-use-minesweeper/react';

type Props = Pick<Minesweeper, 'reset'> & { preset: Preset };

export const GameToolBar: React.FC<Props> = ({ reset, preset }) => {
  return (
    <nav className='flex justify-start'>
      <select
        className='bg-slate-500 p-1.5 rounded-none text-sm text-slate-100 focus:bg-slate-400 focus:scale-110 origin-left'
        onChange={(e) => {
          const value = e.target.value;
          if (Object.hasOwn(PRESETS, value)) reset({ preset: value as Preset });
        }}
        value={preset}
      >
        {Object.keys(PRESETS).map((mode) => (
          <option key={mode} value={mode}>
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </option>
        ))}
      </select>
    </nav>
  );
};

export default GameToolBar;
